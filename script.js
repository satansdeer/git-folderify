#!/usr/bin/env node

import { promisify } from "util";
import { exec } from "child_process";
const execAsync = promisify(exec);

console.log(process.argv[2]);

const outFolder = process.argv[2];

if (!outFolder) {
  console.log("Missing destination folder");
  process.exit()
}

const { stdout, stderr } = await execAsync("git log --oneline");
if (!stdout) {
  throw stderr;
}

const commits = stdout
  .split("\n")
  .filter((line) => line !== "")
  .map((line) => {
    const [hash, ...nameArray] = line.split(" ");
    return { hash, name: nameArray.join(" ") };
  });

const { stdout: branch } = await execAsync('git branch | grep \*')
const branchName = branch.split("* ")[1]

await execAsync(
  'cat .gitignore > ignorefile.txt && echo ".git\nignorefile.txt" >> ignorefile.txt'
);

for (const commit of commits) {
  console.log(commit.name);
  await execAsync(`git checkout ${commit.hash}`);
  await execAsync(
    `rsync -rv --exclude-from=ignorefile.txt . ${outFolder}/${commit.name}`
  );
}
await execAsync(`cat ignorefile.txt`);
await execAsync(`rm ignorefile.txt`);
await execAsync(`git checkout ${branchName}`);
