import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];

export default defineConfig({
  plugins: [react()],
  // GitHub Pages projects are hosted under /repository-name/.
  // Local development continues to use the root path.
  base: process.env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}/` : '/',
});
