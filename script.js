import { promisify } from "util"
import { exec } from "child_process"
const execAsync = promisify(exec)

const { stdout, stderr } = await execAsync("git log --oneline")
if(!stdout){
	throw(stderr)
}
const commits = stdout.split("\n").filter(line => line !== "").map(line => {
	const [hash, ...nameArray] = line.split(" ")
	return {hash, name: nameArray.join(" ")}
})

const { stdout: pwdResult } = await execAsync('echo "${PWD##*/}"')
const currentFolder = pwdResult.replace("\n", "").trim()

await execAsync(`mkdir ../${currentFolder}-steps`)
for (const commit of commits) {
	await execAsync(`git checkout ${commit.hash}`)
	await execAsync(`cp -r . ../folderify-steps/${commit.name}`)
}
await execAsync(`git checkout main`)
await execAsync(`mv ../${currentFolder}-steps .`)
