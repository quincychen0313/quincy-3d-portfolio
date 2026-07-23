# Quincy — 3D Creator Portfolio

A responsive single-page portfolio built with React, TypeScript, Tailwind CSS, Framer Motion, and Lucide React.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Publish with GitHub Pages

This repository includes `.github/workflows/deploy-pages.yml`.

1. Upload the project files to the root of a GitHub repository.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push or commit to the `main` branch.
5. Open the **Actions** tab and wait for **Deploy to GitHub Pages** to complete.

The Vite base path is detected automatically from the GitHub repository name during deployment, so the repository can be renamed without editing `vite.config.ts`.

## Notes

- The page uses Google Fonts and externally hosted image/GIF assets, so an internet connection is required to display all media.
- Replace the placeholder navigation/button destinations with Quincy's real pages or contact information before deployment.
