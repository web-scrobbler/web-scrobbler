import { UserConfig, normalizePath } from 'vite';
import { resolve } from 'path';
import * as manifests from './manifest.config';
import solid from 'vite-plugin-solid';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import compileConnectors from './scripts/compile-connectors';
import makeManifest from './scripts/make-manifest';
import { isDev, releaseTarget } from 'scripts/util';
import minifyImages from 'scripts/minify-images';

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
	const browser = releaseTarget;
	if (!browser || !(browser in builds)) {
		return builds.error;
	}
	return builds[browser as keyof typeof builds];
}

export const buildBackground: UserConfig = {
	...common,
	build: {
		minify: !isDev(),
		outDir: resolve(distRoot(), 'background'),
		emptyOutDir: true,
		watch: isDev() ? {} : null,
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
		minify: !isDev(),
		outDir: resolve(distRoot(), 'content'),
		emptyOutDir: true,
		watch: isDev() ? {} : null,
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
		minify: !isDev(),
		outDir: distRoot(),
		emptyOutDir: false,
		watch: isDev() ? {} : null,
		sourcemap: isDev(),
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
					src: normalizePath(resolve(root, '_locales')),
					dest: '',
				},
			],
		}),
		compileConnectors({
			isDev: isDev(),
			watchDirectory: 'src/connectors/*',
		}),
		minifyImages(),
	],
};
