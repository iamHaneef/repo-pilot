# RepoPilot

A Node.js CLI that automates GitHub repository creation, initialization, publishing, and deletion.

The project automates the repetitive Git and GitHub CLI workflow involved in publishing local projects to GitHub.

## Features

### Create Repository

Automatically:

- Accepts a repository name
- Accepts a repository description
- Supports README creation option
- Accepts a local project folder
- Initializes Git
- Creates the initial commit
- Creates the GitHub repository
- Connects the remote repository
- Pushes the project to GitHub

### Delete Repository

Automatically:

- Accepts one or multiple repository names
- Displays the repositories before deletion
- Requires explicit `DELETE` confirmation
- Deletes the selected GitHub repositories using GitHub CLI
- Reports successful and failed deletions

## Development Status

RepoPilot V1.1 is Completed.

## Tech Stack

- Node.js
- Git
- GitHub CLI
- JavaScript

## Prerequisites

Before using the automation, make sure the following are installed:

- Node.js
- Git
- GitHub CLI

GitHub CLI must also be authenticated:

```bash
gh auth login