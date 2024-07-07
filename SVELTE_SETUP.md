# Sveltekit & Github Project Setup

Below are the steps I use to create a Sveltekit project with a remote Github repository.

## 1 - Create a Blank Remote Github Repository

First, go to Github and create a new repository *without* a README, .gitignore, or license file.  I usually use the same name for both the Github.com remote repository and the Sveltekit project directory.

## 2 - Create a Sveltekit Project

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

## 3 -Create a Local Git Repository and Connect it to the Remote Github Repo

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

Whenever I commit changes to the local repo, I also use VScode to 'push' or 'sync' the changes with the remote repo.

## 4 - Set up **app.html** for Bootstrap, Popper, favicon, etc

First, copy the preferred **favicon.png** (such as **Collin.jpg**) into the **static** folder.

Then, repplace the main **app.html** with:

```html
<!doctype html>
<html lang="en">
	<head>
		<!-- Required meta tags -->
		<meta charset="utf-8" />

		<!-- Responsiveness meta tag -->
		<meta name="viewport" content="width=device-width, initial-scale=1" />

		<!-- Bootstrap CSS (5.3.2) -->
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">

		<!-- favicon  -->
		<link rel="icon" href="%sveltekit.assets%/Collin.jpg" />

		<!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> -->
		
		<!-- The following is replaced by each +page.svelte's <svelte:head>
			content, if any, such as:
			<svelte:head>
				<title>Bevins-Riley</title>
				<meta name="description" content="Bevins-Riley genealogy" />
			</svelte:head> -->
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<!-- Option 1: Bootstrap Bundle with Popper -->
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
		
		<!-- Option 2: Separate Popper and Bootstrap JS
			<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
			<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js" integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+" crossorigin="anonymous"></script>
		-->
		<div>
			<div style="display: contents">%sveltekit.body%</div>
		</div>		
	</body>
</html>
```

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
