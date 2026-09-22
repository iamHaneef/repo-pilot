const readline = require("readline");
const { execFileSync } = require("child_process");
const { performance } = require("perf_hooks");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const OWNER = "iamHaneef";

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function runCommand(command, args) {
  const start = performance.now();

  console.log(`\n> ${command} ${args.join(" ")}`);

  try {
    const output = execFileSync(command, args, {
      encoding: "utf8",
      stdio: ["inherit", "pipe", "pipe"],
    });

    const elapsed = ((performance.now() - start) / 1000).toFixed(2);

    console.log(`✓ Completed in ${elapsed}s`);

    if (output.trim()) {
      console.log(output.trim());
    }

    return true;
  } catch (error) {
    const elapsed = ((performance.now() - start) / 1000).toFixed(2);

    console.log(`✗ Failed after ${elapsed}s`);

    if (error.stderr) {
      console.log(error.stderr.toString().trim());
    }

    return false;
  }
}

async function main() {
  const totalStart = performance.now();

  console.log(`
======================================
   GitHub Repository Removal V1
======================================
`);

  const input = await ask(
    "Repository name(s) to delete (comma separated): "
  );

  const repositories = [
    ...new Set(
      input
        .split(",")
        .map((repo) => repo.trim())
        .filter(Boolean)
    ),
  ];

  if (repositories.length === 0) {
    console.log("\n✗ No repository name provided.");
    rl.close();
    return;
  }

  // Validate repository names
  for (const repo of repositories) {
    if (
      repo.includes(" ") ||
      repo.includes("/") ||
      repo.includes("\\")
    ) {
      console.log(`\n✗ Invalid repository name: ${repo}`);
      console.log(
        "Use only the repository name, for example: aile-alpha"
      );
      rl.close();
      return;
    }
  }

  console.log(`
======================================
             DELETE LIST
======================================
`);

  repositories.forEach((repo, index) => {
    console.log(`${index + 1}. ${OWNER}/${repo}`);
  });

  console.log(`
⚠ WARNING:
These GitHub repositories will be permanently deleted.
This action cannot be undone.
`);

  const confirmation = await ask(
    'Type "DELETE" to continue: '
  );

  if (confirmation.trim() !== "DELETE") {
    console.log("\n✓ Deletion cancelled. Nothing was changed.");
    rl.close();
    return;
  }

  console.log(`
======================================
          GITHUB DELETE
======================================
`);

  let successCount = 0;
  let failedCount = 0;

  for (const repo of repositories) {
    const success = runCommand("gh", [
      "repo",
      "delete",
      `${OWNER}/${repo}`,
      "--yes",
    ]);

    if (success) {
      successCount++;
    } else {
      failedCount++;
    }
  }

  const totalTime = ((performance.now() - totalStart) / 1000).toFixed(2);

  console.log(`
======================================
        REMOVAL COMPLETE
======================================

✓ Deleted : ${successCount}
✗ Failed  : ${failedCount}
⏱ TOTAL TIME: ${totalTime}s
`);

  if (successCount > 0) {
    console.log("Deleted repositories:");
    repositories.forEach((repo) => {
      console.log(`  ✓ ${OWNER}/${repo}`);
    });
  }

  rl.close();
}

main();