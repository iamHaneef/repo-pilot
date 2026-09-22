const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const readline = require("readline");
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

function runCommand(command, args, cwd) {
  const start = performance.now();

  console.log(`\n> ${command} ${args.join(" ")}`);

  try {
    const output = execFileSync(command, args, {
      cwd,
      encoding: "utf8",
      stdio: "pipe",
    });

    const elapsed = ((performance.now() - start) / 1000).toFixed(2);

    console.log(`✓ Completed in ${elapsed}s`);

    if (output.trim()) {
      console.log(output.trim());
    }

    return true;
  } catch (error) {
    const elapsed = ((performance.now() - start) / 1000).toFixed(2);

    console.log(`❌ Failed after ${elapsed}s`);

    if (error.stdout) {
      console.log(error.stdout.toString());
    }

    if (error.stderr) {
      console.log(error.stderr.toString());
    }

    return false;
  }
}

async function main() {
  const totalStart = performance.now();

  console.log("\n======================================");
  console.log("   GitHub Repository Automation V1.1");
  console.log("======================================\n");

  // 1. Repository name
  const repoName = (await ask("Repository name: ")).trim();

  if (!repoName) {
    console.log("\n❌ Repository name cannot be empty.");
    rl.close();
    return;
  }

  // GitHub repository names cannot contain spaces.
  if (/\s/.test(repoName)) {
    console.log("\n❌ Repository name cannot contain spaces.");
    console.log("Example: aile-alpha");
    rl.close();
    return;
  }

  // 2. Description
  const description = (await ask("Repository description: ")).trim();

  // 3. README
  let createReadme;

  while (true) {
    const answer = (await ask("Create README? (y/n): "))
      .trim()
      .toLowerCase();

    if (answer === "y" || answer === "yes") {
      createReadme = true;
      break;
    }

    if (answer === "n" || answer === "no") {
      createReadme = false;
      break;
    }

    console.log("Please enter y or n.");
  }

  // 4. Local folder
  const folderPath = (await ask("Local project folder: ")).trim();

  if (!fs.existsSync(folderPath)) {
    console.log("\n❌ Folder does not exist:");
    console.log(folderPath);
    rl.close();
    return;
  }

  if (!fs.statSync(folderPath).isDirectory()) {
    console.log("\n❌ The provided path is not a folder.");
    rl.close();
    return;
  }

  // ======================================
  // SUMMARY
  // ======================================

  console.log("\n======================================");
  console.log("              INPUT");
  console.log("======================================");

  console.log(`Repository : ${repoName}`);
  console.log(`Description: ${description || "(none)"}`);
  console.log(`README     : ${createReadme ? "Yes" : "No"}`);
  console.log(`Folder     : ${folderPath}`);

  // ======================================
  // CHECK EXISTING .git
  // ======================================

  const gitPath = path.join(folderPath, ".git");

  if (fs.existsSync(gitPath)) {
    console.log("\n⚠ A .git directory already exists.");

    console.log(
      "This V1 test expects a folder that is not already a Git repository."
    );

    console.log("Refusing to modify the existing Git repository.");

    rl.close();
    return;
  }

  console.log("\n✓ No .git directory found.");
  console.log("✓ Safe to initialize as a new repository.");

  // ======================================
  // README
  // ======================================

  if (createReadme) {
    const readmePath = path.join(folderPath, "README.md");

    if (!fs.existsSync(readmePath)) {
      fs.writeFileSync(
        readmePath,
        `# ${repoName}\n\n${description}\n`,
        "utf8"
      );

      console.log("✓ README.md created.");
    } else {
      console.log("✓ Existing README.md preserved.");
    }
  }

  // ======================================
  // GIT INIT
  // ======================================

  console.log("\n======================================");
  console.log("             GIT SETUP");
  console.log("======================================");

  if (!runCommand("git", ["init"], folderPath)) {
    rl.close();
    return;
  }

  if (!runCommand("git", ["branch", "-M", "main"], folderPath)) {
    rl.close();
    return;
  }

  if (!runCommand("git", ["add", "."], folderPath)) {
    rl.close();
    return;
  }

  if (
    !runCommand(
      "git",
      ["commit", "-m", "Initial commit"],
      folderPath
    )
  ) {
    rl.close();
    return;
  }

  // ======================================
  // GITHUB CREATE + PUSH
  // ======================================

  console.log("\n======================================");
  console.log("       GITHUB CREATE + PUSH");
  console.log("======================================");

  const ghArgs = [
    "repo",
    "create",
    `iamHaneef/${repoName}`,
    "--public",
    "--source",
    ".",
    "--remote",
    "origin",
    "--push",
  ];

  if (description) {
    ghArgs.push("--description", description);
  }

  if (!runCommand("gh", ghArgs, folderPath)) {
    console.log("\n⚠ Local Git repository was created.");
    console.log("⚠ GitHub creation/push failed.");

    rl.close();
    return;
  }

  // ======================================
  // COMPLETE
  // ======================================

  const totalTime = (
    (performance.now() - totalStart) /
    1000
  ).toFixed(2);

  console.log("\n======================================");
  console.log("        AUTOMATION COMPLETE");
  console.log("======================================");

  console.log(`\n✓ Repository : ${repoName}`);
  console.log(`✓ Description: ${description}`);
  console.log(`✓ README     : ${createReadme ? "Yes" : "No"}`);
  console.log(`✓ Local path : ${folderPath}`);
  console.log(`✓ Git        : initialized`);
  console.log(`✓ Commit     : created`);
  console.log(`✓ GitHub     : created`);
  console.log(`✓ Push       : completed`);

  console.log(
    `\n⏱ TOTAL TIME: ${totalTime} seconds`
  );

  console.log(
    `\nhttps://github.com/iamHaneef/${repoName}`
  );

  rl.close();
}

main();