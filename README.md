# 🚀 RepoPilot

A Node.js CLI that automates common Git and GitHub repository workflows — from creating and publishing a local project to updating existing repositories and deleting repositories safely.

RepoPilot was built to remove repetitive Git commands and simplify the process of managing GitHub repositories directly from the terminal.

---

## ✨ Features

### 🆕 Create Repository

Automatically:

- Accepts a repository name
- Accepts a repository description
- Supports README creation option
- Accepts a local project folder
- Validates the project folder
- Checks whether a `.git` directory already exists
- Initializes Git
- Creates the `main` branch
- Stages project files
- Creates the initial commit
- Creates the GitHub repository
- Configures the GitHub remote
- Pushes the project to GitHub
- Reports execution time

### 🔄 Update Repository

Automatically:

- Detects whether the current folder is a Git repository
- Checks for modified, added, or deleted files
- Displays detected changes
- Requests a commit message
- Stages changes
- Creates a Git commit
- Pushes changes to the configured GitHub remote
- Stops safely when there are no changes
- Reports execution time

### 🗑️ Delete Repository

Automatically:

- Accepts one or multiple GitHub repository names
- Displays the repositories selected for deletion
- Requires explicit `DELETE` confirmation
- Deletes the selected GitHub repositories using GitHub CLI
- Reports successful and failed deletions
- Protects against accidental deletion through confirmation

---

# ⚙️ Initial Setup

> **Important:** The first-time setup is the most important part of RepoPilot.
>
> RepoPilot uses both **Git** and **GitHub CLI**, so they must be installed and configured correctly before running the automation.
>
> Once this setup is completed, you normally do **not** need to repeat the authentication process for every repository.

---

## 1️⃣ Install Node.js

Install Node.js on your computer.

Verify the installation:

    node --version
    npm --version

Example:

    v24.x.x
    11.x.x

Node.js is required because RepoPilot is built with JavaScript and runs through Node.js.

---

## 2️⃣ Install Git

Install Git for your operating system.

Verify:

    git --version

Example:

    git version 2.x.x

Git is required because RepoPilot uses Git commands internally for repository initialization, commits, and pushing changes.

---

## 3️⃣ Install GitHub CLI

RepoPilot uses the official GitHub CLI (`gh`) to communicate with GitHub.

Verify:

    gh --version

### Windows

If GitHub CLI is not installed on Windows, install it using:

    winget install --id GitHub.cli

After installation, close and reopen your terminal.

Then verify again:

    gh --version

---

## 4️⃣ Authenticate GitHub CLI 🔐

This is a **one-time setup** for your computer and GitHub account.

Run:

    gh auth login

Follow the prompts.

Recommended options:

    GitHub.com
    HTTPS
    Login with a web browser

After authentication, verify:

    gh auth status

You should see that you are logged in to GitHub.

### ✅ Important

You do **not** need to run `gh auth login` every time you create or update a repository.

Once authenticated, RepoPilot can reuse the GitHub CLI authentication.

---

## 5️⃣ Enable Repository Deletion Permission 🗑️

The create and update features do not normally require repository deletion permission.

However, `delete-repo.js` uses:

    gh repo delete

For repository deletion, GitHub CLI may require the `delete_repo` authorization scope.

If deletion reports a permission or scope error, run:

    gh auth refresh -h github.com -s delete_repo

Then verify:

    gh auth status

After this, the delete automation can remove repositories that your GitHub account has permission to delete.

---

# 📦 Install RepoPilot

Clone the repository:

    git clone https://github.com/iamHaneef/repo-pilot.git

Move into the project:

    cd repo-pilot

RepoPilot currently has no external npm dependencies, so `npm install` is not required for the current version.

You can run the scripts directly with Node.js.

---

# 🚀 Create a New GitHub Repository

Run:

    node create-repo.js

RepoPilot will ask for:

    Repository name:
    Repository description:
    Create README? (y/n):
    Local project folder:

Example:

    Repository name: my-project
    Repository description: My new project
    Create README? (y/n): n
    Local project folder: H:\Projects\my-project

RepoPilot then performs:

    Local Project
         ↓
    Check project
         ↓
    Check for existing .git
         ↓
    git init
         ↓
    Create main branch
         ↓
    git add .
         ↓
    git commit
         ↓
    Create GitHub repository
         ↓
    Configure origin
         ↓
    git push
         ↓
    ✅ GitHub repository ready

### ⚠️ Important: `.git` Directory

The project folder you provide should **not already contain a `.git` directory**.

Correct:

    my-project/
    ├── src/
    ├── public/
    ├── package.json
    ├── README.md
    └── .gitignore

Incorrect:

    my-project/
    ├── .git/
    ├── src/
    └── ...

RepoPilot checks for an existing `.git` directory before initializing the repository.

This prevents the create workflow from interfering with an existing Git repository.

---

# 🔄 Update an Existing Repository

After a repository has already been created and pushed, you can modify its local files.

For example:

    README.md
    src/App.jsx
    package.json

After making your changes, run `update-repo.js` **inside that existing Git repository**:

    node update-repo.js

RepoPilot will:

    Check Git repository
           ↓
    Check changes
           ↓
    Show changed files
           ↓
    Ask for commit message
           ↓
    git add .
           ↓
    git commit
           ↓
    git push
           ↓
    ✅ GitHub updated

Example:

    Commit message: Improve README documentation

You do not need to manually run:

    git add .
    git commit
    git push

RepoPilot handles those operations.

### ℹ️ Important

The current `update-repo.js` operates on the **Git repository in the directory where it is executed**.

The repository must already have a GitHub remote configured.

---

# 🗑️ Delete GitHub Repository

Run:

    node delete-repo.js

You can delete one repository:

    aile-test

or multiple repositories:

    aile-test,aile-demo,aile-old

RepoPilot displays the repositories before deletion:

    ======================================
                 DELETE LIST
    ======================================

    1. iamHaneef/aile-test
    2. iamHaneef/aile-demo
    3. iamHaneef/aile-old

It then requires explicit confirmation:

    Type "DELETE" to continue:

Only entering:

    DELETE

will continue the operation.

---

# 🪟 Windows Setup & Common Terminal Issues

RepoPilot works with:

- PowerShell
- Command Prompt
- VS Code integrated terminal
- Windows Terminal

### Switching Drives in Command Prompt

A common Windows issue is switching from the `C:` drive to another drive.

For example:

    cd H:\Documents\NewFolder\repo-pilot

may leave you on the `C:` drive in Command Prompt.

Use:

    cd /d H:\Documents\NewFolder\repo-pilot

or:

    H:
    cd H:\Documents\NewFolder\repo-pilot

Then verify your location:

    cd

In PowerShell:

    Get-Location

---

# 🧪 Verify Your Environment

Before troubleshooting RepoPilot, verify all required tools:

    node --version
    npm --version
    git --version
    gh --version
    gh auth status

A healthy setup should look approximately like:

    Node.js       ✅
    npm           ✅
    Git           ✅
    GitHub CLI    ✅
    GitHub Auth   ✅

Once these are working, RepoPilot is ready to use.

---

# 🧩 Common First-Time Problems

## ❌ `node` is not recognized

Node.js is either not installed or is not available in your PATH.

Install Node.js and restart your terminal.

Then verify:

    node --version

---

## ❌ `git` is not recognized

Git is not installed or is not available in your PATH.

Install Git and restart your terminal.

Then verify:

    git --version

---

## ❌ `gh` is not recognized

GitHub CLI is not installed or the terminal has not been restarted after installation.

Install it on Windows:

    winget install --id GitHub.cli

Then restart the terminal and verify:

    gh --version

---

## ❌ `gh auth status` shows that you are not logged in

Run:

    gh auth login

Then verify:

    gh auth status

---

## ❌ Delete operation reports a permission or scope error

Refresh the GitHub CLI authentication:

    gh auth refresh -h github.com -s delete_repo

Then verify:

    gh auth status

---

## ❌ `fatal: not a git repository`

You are either:

- Running `update-repo.js` outside a Git repository, or
- The project's `.git` directory does not exist.

Check:

    git status

For `update-repo.js`, run the script from an existing Git repository.

---

## ❌ Create operation says `.git` already exists

The project is already a Git repository.

The create workflow is intended for a new local project that has not yet been initialized with Git.

Use the update workflow for an existing repository.

---

## ❌ GitHub repository already exists

The requested repository name may already exist on your GitHub account.

Choose another repository name or use the existing repository's update workflow.

---

# 🔄 Recommended Workflow

### 🆕 Brand-New Project

    📁 Local Project
          ↓
    🚀 create-repo.js
          ↓
    🐙 GitHub Repository

### ✏️ Existing Project

    📁 Existing Git Repository
          ↓
    ✏️ Modify Files
          ↓
    🔄 update-repo.js
          ↓
    🐙 GitHub Updated

### 🗑️ Remove Repository

    🗑️ delete-repo.js
          ↓
    ⚠️ Confirmation
          ↓
    ❌ GitHub Repository Deleted

---

# 📁 Project Structure

    repo-pilot/
    │
    ├── create-repo.js       # Create and publish a new repository
    ├── update-repo.js       # Commit and push changes
    ├── delete-repo.js       # Delete one or multiple repositories
    ├── package.json         # Project metadata and npm scripts
    ├── README.md            # Documentation
    ├── LICENSE              # MIT License
    └── .gitignore           # Ignored files

---

# 🧰 npm Commands

RepoPilot also provides npm scripts.

### Create

    npm run create

Creates and publishes a new repository.

### Update

    npm run update

Commits and pushes changes to an existing repository.

### Delete

    npm run delete

Deletes one or multiple GitHub repositories.

---

# 📊 Current Version

## RepoPilot V1.1 — Completed ✅

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

If you find a bug or have an idea for improving RepoPilot, open an issue or submit a pull request.

---

# 📄 License

RepoPilot is licensed under the MIT License.

See the [LICENSE](LICENSE) file for details.

---

# 👨‍💻 Author

**Muhamad Haneef**

GitHub: https://github.com/iamHaneef

---

⭐ If RepoPilot helps simplify your GitHub workflow, consider giving the project a star.