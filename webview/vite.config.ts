import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const DEV_SERVER_HOST = '127.0.0.1';
const DEV_SERVER_PORT = 5173;

export default defineConfig({
	base: './',
	plugins: [vue()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'@shared': fileURLToPath(new URL('../shared', import.meta.url)),
		},
	},
	server: {
		host: DEV_SERVER_HOST,
		port: DEV_SERVER_PORT,
		strictPort: true,
		cors: true,
		hmr: {
			host: DEV_SERVER_HOST,
			port: DEV_SERVER_PORT,
			clientPort: DEV_SERVER_PORT,
			protocol: 'ws',
		},
	},
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		manifest: true,
		emptyOutDir: true,
	},
});
