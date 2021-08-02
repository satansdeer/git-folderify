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

for (const commit of commits) {
	await execAsync(`git checkout ${commit.hash}`)
	console.log(await execAsync("git status"))
	console.log('---', commit.name)
	await execAsync(`git checkout main`)
}

console.log(commits)
