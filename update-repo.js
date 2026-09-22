const readline = require("readline");
const { execFileSync } = require("child_process");
const { performance } = require("perf_hooks");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function runGit(args) {
  const start = performance.now();

  console.log(`\n> git ${args.join(" ")}`);

  try {
    const output = execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["inherit", "pipe", "pipe"],
    });

    const elapsed = ((performance.now() - start) / 1000).toFixed(2);

    console.log(`✓ Completed in ${elapsed}s`);

    if (output.trim()) {
      console.log(output.trim());
    }

    return output;
  } catch (error) {
    const elapsed = ((performance.now() - start) / 1000).toFixed(2);

    console.log(`✗ Failed after ${elapsed}s`);

    if (error.stderr) {
      console.log(error.stderr.toString().trim());
    }

    process.exit(1);
  }
}

async function main() {
  const totalStart = performance.now();

  console.log(`
======================================
        RepoPilot Update V1.1
======================================
`);

  // Check whether this is a Git repository
  try {
    execFileSync("git", ["rev-parse", "--is-inside-work-tree"], {
      encoding: "utf8",
      stdio: "pipe",
    });
  } catch {
    console.log("✗ This folder is not a Git repository.");
    console.log("Run this command inside an existing Git repository.");
    rl.close();
    return;
  }

  console.log("✓ Git repository detected.");

  // Check changes
  console.log(`
======================================
             CHANGES
======================================
`);

  const status = runGit(["status", "--short"]);

  if (!status.trim()) {
    console.log("\n✓ Working tree is clean.");
    console.log("Nothing to update.");
    rl.close();
    return;
  }

  console.log("\nChanges detected.");

  // Ask commit message
  const commitMessage = await ask("\nCommit message: ");

  if (!commitMessage.trim()) {
    console.log("\n✗ Commit message cannot be empty.");
    rl.close();
    return;
  }

  console.log(`
======================================
              UPDATE
======================================
`);

  // Stage changes
  runGit(["add", "."]);

  // Commit
  runGit(["commit", "-m", commitMessage.trim()]);

  // Push
  runGit(["push"]);

  const totalTime = ((performance.now() - totalStart) / 1000).toFixed(2);

  console.log(`
======================================
        UPDATE COMPLETE
======================================

✓ Changes checked
✓ Changes staged
✓ Commit created
✓ Changes pushed

⏱ TOTAL TIME: ${totalTime}s
`);

  rl.close();
}

main();