'use strict';

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
const EXTENSION_DOCS = ['*.md'];
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

const BUMP_BRANCH = isCi ? 'origin' : 'upstream';

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
					browser_specific_settings: {
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

		bump: {
			options: {
				files: FILES_TO_BUMP,
				updateConfigs: ['manifest'],
				commitFiles: FILES_TO_BUMP,
				pushTo: BUMP_BRANCH,
			},
		},

		/**
		 * Linter configs.
		 */

		eslint: {
			target: JS_FILES,
			options: {
				cache: !isCi,
				fix: !isCi,
			},
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
			options: {
				fix: !isCi,
			},
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
	 * Release new version.
	 *
	 * For this project GitHub Actions are configured to publish the extension
	 * if new tag is pushed to the project repository.
	 *
	 * @param {String} versionType Release type supported by grunt-bump
	 */
	grunt.registerTask('release', (versionType) => {
		if (!versionType) {
			grunt.fail.fatal('You should specify release type!');
		}

		grunt.task.run(`bump:${versionType}`);
	});

	/**
	 * Run tests.
	 */
	grunt.registerTask('test', ['mochacli']);

	/**
	 * Lint source code using linters specified below.
	 */
	grunt.registerTask('lint', [
		'eslint', 'jsonlint', 'lintspaces',
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
