# Sveltekit & Github Projet Setup

Below are the steps I use to create a Sveltekit project with a Github remote repository.

## Create a Blank Remote Github Repository

First, go to Github and create a new repository *without* a README, .gitignore, or license file.  I usually use the same name for both the Github.com remote repository and the Sveltekit project directory.

## Create a Sveltekit Project

```bash
# from the parent directory of the new project:
npm create svelte@latest project-directory
```

This script offers several options. I usually select:
- a *skeleton* project,
- no typescript,
- enable *lint*, *prettier*, and *vitest*

```bash
# change into the directory and install the required packages
cd project-directory
npm install
```

## Create a Local Git Repository and Connect it to the Remote Github Repo

```bash
# initialize the local Git repository
git init
git add -A
git commit -m "Initial commit"

# connect local repo with the remote Gituhub.com repo
git remote add origin
git branch -M main
git push -u origin main
```

Open VScode, add the new folder to the Workspace, and ensure the **SOURCE CONTROL REPOSITORY** for the folder is attached to **main**.

I then rename the existing README.md to something else (like README_SVELTE.md), and cretae an new README.md with the new folder's actual info.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
