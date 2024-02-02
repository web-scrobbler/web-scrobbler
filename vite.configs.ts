import type { UserConfig } from 'vite';
import * as manifests from './manifest.config';
import solid from 'vite-plugin-solid';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import compileConnectors from './scripts/compile-connectors';
import makeManifest from './scripts/make-manifest';
import { isDev, releaseTarget, resolvePath } from 'scripts/util';
import minifyImages from 'scripts/minify-images';
import generateIcons from 'scripts/generate-icons';
import ConditionalCompile from 'vite-plugin-conditional-compiler';

const dist = resolvePath('build');
const root = resolvePath('src');
const builds = {
	chrome: resolvePath(dist, 'chrome'),
	firefox: resolvePath(dist, 'firefox'),
	safari: resolvePath(dist, 'safariraw'),
	error: resolvePath(dist, 'error'),
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
		outDir: resolvePath(distRoot(), 'background'),
		emptyOutDir: true,
		watch: isDev() ? {} : null,
		lib: {
			entry: resolvePath(root, 'core', 'background', 'main.ts'),
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
	plugins: [ConditionalCompile()],
};

export const buildContent: UserConfig = {
	...common,
	build: {
		minify: !isDev(),
		outDir: resolvePath(distRoot(), 'content'),
		emptyOutDir: true,
		watch: isDev() ? {} : null,
		lib: {
			entry: resolvePath(root, 'core', 'content', 'main.ts'),
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
	plugins: [ConditionalCompile()],
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
				popup: resolvePath(root, 'ui', 'popup', 'index.html'),
				options: resolvePath(root, 'ui', 'options', 'index.html'),
			},
			output: {},
		},
	},
	plugins: [
		ConditionalCompile(),
		solid(),
		makeManifest(),
		generateIcons(),
		viteStaticCopy({
			targets: [
				{
					src: resolvePath(root, '_locales'),
					dest: '',
				},
			],
		}),
		compileConnectors({
			isDev: isDev(),
			watchDirectory: 'src/connectors/*',
		}),
		minifyImages({ isDev: isDev() }),
	],
};
