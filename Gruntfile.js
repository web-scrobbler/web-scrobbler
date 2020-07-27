const getWebpackConfig = require('./webpack.config.js');
const {
	srcDir,
	buildDir,

	browserChrome,
	browserFirefox,

	modeDevelopment,

	manifestFile,

	assertBrowserIsSupported,
	assertBuildModeIsValid,
	configureTsCompilerForTests,
} = require('./shared.config.js');

const DIST_FILE_CHROME = 'web-scrobbler-chrome.zip';
const DIST_FILE_FIREFOX = 'web-scrobbler-firefox.zip';

const manifestPath = `${srcDir}/${manifestFile}`;

const FILES_TO_BUMP = [manifestPath, 'package.json', 'package-lock.json'];

// Files to lint
const JS_FILES = ['*.js', '.grunt', `${srcDir}/**/*.js`, 'tests/**/*.js'];
const TS_FILES = [`${srcDir}/**/*.ts`, 'tests/**/*.ts'];
const JSON_FILES = [`${srcDir}/**/*.json`, '*.json'];
const HTML_FILES = [`${srcDir}/ui/**/*.html`];
const CSS_FILES = [`${srcDir}/ui/**/*.css`];
const VUE_FILES = [`${srcDir}/ui/**/*.vue`];
const DOC_FILES = ['*.md', '.github/**/*.md'];

const isCi = process.env.CI === 'true';

module.exports = (grunt) => {
	grunt.initConfig({
		manifest: grunt.file.readJSON(manifestPath),

		/**
		 * Configs of build tasks.
		 */

		clean: {
			build: buildDir,
			dist: [DIST_FILE_CHROME, DIST_FILE_FIREFOX],
		},
		compress: {
			chrome: {
				options: {
					archive: DIST_FILE_CHROME,
					pretty: true,
				},
				expand: true,
				cwd: buildDir,
				src: '**/*',
			},
			firefox: {
				options: {
					archive: DIST_FILE_FIREFOX,
					pretty: true,
				},
				expand: true,
				cwd: buildDir,
				src: '**/*',
			},
		},
		webpack: {
			chrome: () => getWebpackConfig(browserChrome),
			firefox: () => getWebpackConfig(browserFirefox),
		},

		/**
		 * Publish tasks.
		 */

		bump: {
			options: {
				files: FILES_TO_BUMP,
				updateConfigs: ['manifest'],
				commitFiles: FILES_TO_BUMP,
			},
		},

		/**
		 * Linter configs.
		 */

		eslint: {
			target: [JS_FILES, TS_FILES, VUE_FILES],
			options: {
				cache: !isCi,
				fix: !isCi,
			},
		},
		htmlvalidate: {
			src: [HTML_FILES, VUE_FILES],
		},
		jsonlint: {
			src: JSON_FILES,
		},
		lintspaces: {
			src: [
				JS_FILES,
				TS_FILES,
				JSON_FILES,
				CSS_FILES,
				HTML_FILES,
				VUE_FILES,
			],
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
			all: [CSS_FILES, VUE_FILES],
		},

		/**
		 * Configs of other tasks.
		 */

		mochacli: {
			options: {
				require: [
					'ts-node/register',
					'tsconfig-paths/register',
					'source-map-support/register',
					'tests/helpers/set-stubs',
				],
				reporter: 'progress',
			},
			all: ['tests/**/*.spec.ts'],
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
	 * @param {String} [mode=modeDevelopment] Build mode
	 */
	grunt.registerTask('build', (browser, mode = modeDevelopment) => {
		gruntAssertBrowserIsSupported(browser);
		gruntAssertBuildModeIsValid(mode);

		setBuildMode(mode);

		grunt.task.run(`webpack:${browser}`);
	});

	/**
	 * Build the extension and pack source files in a zipball.
	 * @param {String} browser Browser name
	 * @param {String} [mode=modeDevelopment] Build mode
	 */
	grunt.registerTask('dist', (browser, mode = modeDevelopment) => {
		gruntAssertBrowserIsSupported(browser);
		gruntAssertBuildModeIsValid(mode);

		grunt.task.run([
			'clean:build',
			`build:${browser}:${mode}`,
			`compress:${browser}`,
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
	grunt.registerTask('test', () => {
		configureTsCompilerForTests();

		grunt.task.run('mochacli');
	});

	/**
	 * Lint source code using linters specified below.
	 */
	grunt.registerTask('lint', [
		'eslint',
		'jsonlint',
		'lintspaces',
		'htmlvalidate',
		'stylelint',
		'remark',
		'unused_files',
	]);

	/**
	 * Throw an error if the extension doesn't support given browser.
	 * @param  {String}  browser Browser name
	 */
	function gruntAssertBrowserIsSupported(browser) {
		try {
			assertBrowserIsSupported(browser);
		} catch (err) {
			grunt.fail.fatal(err.message);
		}
	}

	/**
	 * Throw an error if the extension doesn't support given browser.
	 * @param  {String}  mode Mode
	 */
	function gruntAssertBuildModeIsValid(mode) {
		try {
			assertBuildModeIsValid(mode);
		} catch (err) {
			grunt.fail.fatal(err.message);
		}
	}

	function setBuildMode(mode) {
		process.env.NODE_ENV = mode;
	}
};
