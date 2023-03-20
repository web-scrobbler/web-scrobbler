import { UserConfig } from 'vite';
import { resolve } from 'path';
import * as manifests from './manifest.config';
import solid from 'vite-plugin-solid';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import compileConnectors from './scripts/compile-connectors';
import makeManifest from './scripts/make-manifest';

const dist = resolve(import.meta.url.slice(5), '..', 'build');
const root = resolve(import.meta.url.slice(5), '..', 'src');
const builds = {
	chrome: resolve(dist, 'chrome'),
	firefox: resolve(dist, 'firefox'),
	safari: resolve(dist, 'safariraw'),
	error: resolve(dist, 'error'),
};

const common: UserConfig = {
	resolve: {
		alias: [
			{ find: '@', replacement: '/src' },
			{ find: '#', replacement: '/tests' },
		],
	},
};

function distRoot() {
	const browser = process.env.BROWSER;
	if (!browser || !(browser in builds)) {
		return builds.error;
	}
	return builds[browser as keyof typeof builds];
}

export const buildBackground: UserConfig = {
	...common,
	build: {
		minify: false,
		outDir: resolve(distRoot(), 'background'),
		emptyOutDir: true,
		lib: {
			entry: resolve(root, 'core', 'background', 'main.ts'),
			name: manifests.common.name,
			formats: ['iife'],
		},
		rollupOptions: {
			output: {
				entryFileNames: 'main.js',
				extend: true,
			},
		},
	},
};

export const buildContent: UserConfig = {
	...common,
	build: {
		minify: false,
		outDir: resolve(distRoot(), 'content'),
		emptyOutDir: true,
		lib: {
			entry: resolve(root, 'core', 'content', 'main.ts'),
			name: manifests.common.name,
			formats: ['iife'],
		},
		rollupOptions: {
			output: {
				entryFileNames: 'main.js',
				extend: true,
			},
		},
	},
};

export const buildStart: UserConfig = {
	...common,
	build: {
		minify: false,
		outDir: distRoot(),
		emptyOutDir: true,
		rollupOptions: {
			input: {
				popup: resolve(root, 'ui', 'popup', 'index.html'),
				options: resolve(root, 'ui', 'options', 'index.html'),
			},
			output: {},
		},
	},
	plugins: [
		solid(),
		makeManifest(),
		viteStaticCopy({
			targets: [
				{
					src: resolve(root, '_locales'),
					dest: '',
				},
				{
					src: resolve(root, 'icons'),
					dest: '',
				},
				{
					src: resolve(root, 'img'),
					dest: '',
				},
			],
		}),
		compileConnectors(),
	],
};
