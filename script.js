import { promisify } from "util"
import { exec } from "child_process"
const execAsync = promisify(exec)

const { stdout } = await execAsync("git log")
console.log(stdout)
