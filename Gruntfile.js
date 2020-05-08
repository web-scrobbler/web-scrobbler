'use strict';

require('dotenv').config();

const CHROME_EXTENSION_ID = 'hhinaapppaileiechjoiifaancjggfjm';
const FIREFOX_EXTENSION_ID = '{799c0914-748b-41df-a25c-22d008f9e83f}';

const SRC_DIR = 'src';
const BUILD_DIR = 'build';

const DIST_FILE_CHROME = 'web-scrobbler-chrome.zip';
const DIST_FILE_FIREFOX = 'web-scrobbler-firefox.zip';
const MANIFEST_FILE = 'src/manifest.json';

const FILES_TO_PREPROCESS = [
	`${BUILD_DIR}/**/*.js`, `${BUILD_DIR}/**/*.css`, `${BUILD_DIR}/**/*.html`,
];

const FILES_TO_BUMP = [MANIFEST_FILE, 'package.json', 'package-lock.json'];

// Files to build zipball
const EXTENSION_SRC = [
	'**/*',
	// Skip SVG
	'!icons/*.svg',
];
const EXTENSION_DOCS = [
	'README.md', 'LICENSE.md',
];
const EXTENSION_EXTRA = [
	'package.json', 'package-lock.json',
];

// Files to lint
const JS_FILES = [
	'*.js',
	// Custom Grunt tasks
	'.grunt',
	// Connectors
	`${SRC_DIR}/connectors/**/*.js`,
	// Core files
	`${SRC_DIR}/core/**/*.js`, `${SRC_DIR}/ui/**/*.js`,
	// Shell Scripts
	'scripts/*.js',
	// Tests
	'tests/**/*.js',
];
const JSON_FILES = ['*.json', `${SRC_DIR}/**/*.json`];
const HTML_FILES = [`${SRC_DIR}/ui/**/*.html`];
const CSS_FILES = [`${SRC_DIR}/ui/**/*.css`];
const DOC_FILES = [
	'*.md', '.github/**/*.md',
];

const isCi = process.env.CI === 'true';

module.exports = (grunt) => {
	grunt.initConfig({
		manifest: grunt.file.readJSON(MANIFEST_FILE),

		/**
		 * Configs of build tasks.
		 */

		clean: {
			build: BUILD_DIR,
			dist: [DIST_FILE_CHROME, DIST_FILE_FIREFOX],
			chrome: [
				`${BUILD_DIR}/icons/icon_firefox_*.png`,
			],
			firefox: [
				`${BUILD_DIR}/icons/icon_chrome_*.png`,
			],
		},
		copy: {
			source_files: {
				expand: true,
				cwd: SRC_DIR,
				src: EXTENSION_SRC,
				dest: BUILD_DIR,
			},
			documentation: {
				expand: true,
				src: EXTENSION_DOCS,
				dest: BUILD_DIR,
			},
			extra_files: {
				expand: true,
				src: EXTENSION_EXTRA,
				dest: BUILD_DIR,
			},
		},
		compress: {
			chrome: {
				options: {
					archive: DIST_FILE_CHROME,
					pretty: true,
				},
				expand: true,
				cwd: BUILD_DIR,
				src: '**/*',
			},
			firefox: {
				options: {
					archive: DIST_FILE_FIREFOX,
					pretty: true,
				},
				expand: true,
				cwd: BUILD_DIR,
				src: '**/*',
			},
		},
		imagemin: {
			static: {
				files: [{
					expand: true,
					src: [
						`${BUILD_DIR}/icons/*.png`,
					],
				}],
			},
		},
		preprocess: {
			main: {
				src: FILES_TO_PREPROCESS,
				expand: true,
				options: {
					inline: true,
					context: { /* generated */ },
				},
			},
		},
		replace_json: {
			chrome: {
				src: `${BUILD_DIR}/manifest.json`,
				changes: {
					options_ui: undefined,
				},
			},
			firefox: {
				src: `${BUILD_DIR}/manifest.json`,
				changes: {
					applications: {
						gecko: {
							id: FIREFOX_EXTENSION_ID,
							strict_min_version: '53.0',
						},
					},
					icons: {
						16: '<%= manifest.icons.16 %>',
						48: 'icons/icon_firefox_48.png',
						128: 'icons/icon_firefox_128.png',
					},

					options_page: undefined,
				},
			},
		},

		/**
		 * Publish tasks.
		 */

		amo_upload: {
			issuer: process.env.AMO_ISSUER,
			secret: process.env.AMO_SECRET,
			id: FIREFOX_EXTENSION_ID,
			version: '<%= manifest.version %>',
			src: DIST_FILE_FIREFOX,
		},
		bump: {
			options: {
				files: FILES_TO_BUMP,
				updateConfigs: ['manifest'],
				commitFiles: FILES_TO_BUMP,
			},
		},
		publish_github_drafts: {
			owner: 'web-scrobbler',
			repo: 'web-scrobbler',
			token: process.env.GH_TOKEN,
			tag: 'v<%= manifest.version %>', // Add `v` prefix for tags
		},
		webstore_upload: {
			accounts: {
				default: {
					publish: true,
					client_id: process.env.CHROME_CLIENT_ID,
					client_secret: process.env.CHROME_CLIENT_SECRET,
					refresh_token: process.env.CHROME_REFRESH_TOKEN,
				},
			},
			extensions: {
				'web-scrobbler': {
					appID: CHROME_EXTENSION_ID,
					zip: DIST_FILE_CHROME,
				},
			},
		},

		/**
		 * Linter configs.
		 */

		eslint: {
			target: JS_FILES,
			options: {
				fix: !isCi,
			},
		},
		htmlvalidate: {
			src: HTML_FILES,
		},
		jsonlint: {
			src: JSON_FILES,
		},
		lintspaces: {
			src: [JS_FILES, JSON_FILES, CSS_FILES, HTML_FILES],
			options: {
				editorconfig: '.editorconfig',
				ignores: ['js-comments'],
			},
		},
		remark: {
			options: {
				quiet: true,
				frail: true,
			},
			src: DOC_FILES,
		},
		stylelint: {
			all: CSS_FILES,
		},

		/**
		 * Configs of other tasks.
		 */

		mochacli: {
			options: {
				require: ['tests/requirejs-config'],
				reporter: 'progress',
			},
			all: [
				'tests/background/*.js',
				'tests/content/*.js',
			],
		},
	});

	require('jit-grunt')(grunt, {
		mochacli: 'grunt-mocha-cli',
		htmlvalidate: 'grunt-html-validate',
	});
	grunt.loadTasks('.grunt');

	/**
	 * Some tasks take browser name as an argument.
	 * We support only Chrome and Firefox, which can be specified
	 * as 'chrome' and 'firefox' respectively:
	 *
	 *   Create a zipball for Chrome browser
	 *   > grunt dist:chrome
	 *
	 *   Build the extension for Firefox browser
	 *   > grunt build:firefox
	 */

	/**
	 * Copy source filed to build directory, preprocess them and
	 * set the extension icon according to specified browser.
	 * @param {String} browser Browser name
	 * @param {String} [mode=debug] Development mode (debug or release)
	 */
	grunt.registerTask('build', (browser, mode = 'debug') => {
		assertBrowserIsSupported(browser);
		assertDevelopmentModeIsValid(mode);

		const flags = {
			chrome: 'CHROME', firefox: 'FIREFOX',
			debug: 'DEBUG', release: 'RELEASE',
		};

		const config = grunt.config.get('preprocess');
		config.main.options.context = {
			[flags[browser]]: true, [flags[mode]]: true,
		};
		grunt.config.set('preprocess', config);

		grunt.task.run([
			'copy',
			'preprocess',
			`replace_json:${browser}`,
		]);
	});

	/**
	 * Build the extension and pack source files in a zipball.
	 * @param {String} browser Browser name
	 * @param {String} [mode=debug] Development mode (debug or release)
	 */
	grunt.registerTask('dist', (browser, mode = 'debug') => {
		assertBrowserIsSupported(browser);
		assertDevelopmentModeIsValid(mode);

		grunt.task.run([
			'clean:build',
			`build:${browser}:${mode}`,
			`clean:${browser}`,
			'imagemin',
			`compress:${browser}`,
			'clean:build',
		]);
	});

	/**
	 * Publish data.
	 * @param  {String} browser Browser name
	 */
	grunt.registerTask('publish', (browser) => {
		assertBrowserIsSupported(browser);

		grunt.task.run(
			[`dist:${browser}:release`, `upload:${browser}`, 'clean:dist']);
	});

	/**
	 * Release new version.
	 *
	 * For this project Travis CI is configured to publish the extension
	 * if new tag is pushed to the project repository.
	 *
	 * As a fallback, the extension can be released locally:
	 * > grunt release:%type%:local
	 *
	 * @param {String} versionType Release type supported by grunt-bump
	 * @param {String} releaseMode Release mode (local or empty)
	 */
	grunt.registerTask('release', (versionType, releaseMode) => {
		if (!versionType) {
			grunt.fail.fatal('You should specify release type!');
		}

		const releaseTasks = [`bump:${versionType}`];

		if (releaseMode) {
			if (releaseMode !== 'local') {
				grunt.fail.fatal(`Unknown release type: ${releaseMode}`);
			}

			const publishTasks = [
				'publish:chrome', 'publish:firefox', 'github_release',
			];
			releaseTasks.push(...publishTasks);
		}

		grunt.task.run(releaseTasks);
	});

	/**
	 * Upload new version.
	 *
	 * @param  {String} browser Browser name
	 */
	grunt.registerTask('upload', (browser) => {
		switch (browser) {
			case 'chrome':
				grunt.task.run('webstore_upload');
				break;
			case 'firefox':
				grunt.task.run('amo_upload');
				break;
		}
	});

	/**
	 * Run tests.
	 */
	grunt.registerTask('test', ['mochacli']);

	/**
	 * Lint source code using linters specified below.
	 */
	grunt.registerTask('lint', [
		'eslint', 'jsonlint', 'lintspaces', 'htmlvalidate',
		'stylelint', 'remark', 'unused_files',
	]);

	/**
	 * Throw an error if the extension doesn't support given browser.
	 * @param  {String}  browser Browser name
	 */
	function assertBrowserIsSupported(browser) {
		const supportedBrowsers = ['chrome', 'firefox'];
		const browsersLabel = `Currently supported browsers: ${supportedBrowsers.join(', ')}`;

		if (!browser) {
			grunt.fail.fatal(`You have not specified browser.\n${browsersLabel}.`);
		}

		if (!supportedBrowsers.includes(browser)) {
			grunt.fail.fatal(`Unknown browser: ${browser}.\n${browsersLabel}.`);
		}
	}

	/**
	 * Throw an error if the extension doesn't support given browser.
	 * @param  {String}  mode Mode
	 */
	function assertDevelopmentModeIsValid(mode) {
		const supportedModes = ['debug', 'release'];
		const modesLabel = `Currently supported modes: ${supportedModes.join(', ')}`;

		if (!mode) {
			grunt.fail.fatal(`You have not specified mode.\n${modesLabel}.`);
		}

		if (!supportedModes.includes(mode)) {
			grunt.fail.fatal(`Unknown mode: ${mode}.\n${modesLabel}.`);
		}
	}
};
