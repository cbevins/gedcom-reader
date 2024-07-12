# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in new folder gedcom-reader
npm create svelte@latest gedcom-reader
cd gedcom-reader

# install dependecies
npm install

# set up git and connect to github
git init
git add -A
git commit -m "Initial commit"
```

## Connecting Local Repo to Github.com

At this point, create a new Github repository (i.e., gedcom-reader) *without* either a README.md or .gitignore file.  Then attach the local repo to the Github repo:

```bash
git remote add origin https://github.com/cbevins/gedcom-reader.git
git push --all origin
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
