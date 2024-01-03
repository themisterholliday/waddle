// eslint-disable-next-line node/no-unpublished-import
import {defineConfig} from 'vite';
// eslint-disable-next-line node/no-unpublished-import
import {svelte} from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
});
