'use strict';

const fs = require('fs');

module.exports = function(grunt) {
	let isTravisCi = (process.env.TRAVIS === 'true');

	const chromeExtensionId = 'hhinaapppaileiechjoiifaancjggfjm';
	const amoExtensionId = '{799c0914-748b-41df-a25c-22d008f9e83f}';

	const srcDir = 'src';
	const buildDir = 'build';
	const packageName = 'web-scrobbler.zip';
	const manifestFile = 'src/manifest.json';

	// Files to build package
	const extensionSources = [
		'**/*',
		// Skip files
		'!content/testReporter.js', '!icons/src/**',
	];
	const documentationFiles = [
		'README.md', 'LICENSE.md'
	];

	// Files to lint
	const jsFiles = [
		// Custom Grunt tasks
		'.grunt',
		// Connectors
		`${srcDir}/connectors/**/*.js`,
		// Core files
		`${srcDir}/core/**/*.js`, `${srcDir}/options/*.js`,
		`${srcDir}/popups/*.js`,
		// Tests
		'tests/**/*.js'
	];
	const jsonFiles = ['*.json', '.stylelintrc'];
	const htmlFiles = [`${srcDir}/options/*.html`, `${srcDir}/popups/*.html`];
	const cssFiles = [`${srcDir}options/*.css`, `${srcDir}/popups/*.css`];

	const webStoreConfig = loadWebStoreConfig();
	const githubConfig = loadGithubConfig();
	const amoConfig = loadAmoConfig();

	grunt.initConfig({
		manifest: grunt.file.readJSON(manifestFile),

		/**
		 * Configs of build tasks.
		 */

		clean: {
			build: buildDir,
			package: [packageName],
			chrome: [
				`${buildDir}/icons/icon128_firefox.png`,
				`${buildDir}/icons/icon48_firefox.png`
			],
		},
		copy: {
			source_files: {
				expand: true,
				cwd: srcDir,
				src: extensionSources,
				dest: buildDir,
			},
			documentation: {
				expand: true,
				src: documentationFiles,
				dest: buildDir,
			}
		},
		compress: {
			main: {
				options: {
					archive: packageName,
					pretty: true
				},
				expand: true,
				cwd: buildDir,
				src: '**/*',
			}
		},
		imagemin: {
			static: {
				options: {
					svgoPlugins: [{
						removeViewBox: false
					}],
				},
				files: [{
					expand: true,
					src: [
						`${buildDir}/icons/*.svg`,
						`${buildDir}/icons/*.png`
					]
				}]
			}
		},
		preprocess: {
			firefox: {
				src: `${buildDir}/**/*.js`,
				expand: true,
				options: {
					inline: true,
					context: {
						FIREFOX: true,
					}
				}
			},
			chrome: {
				src: `${buildDir}/**/*.js`,
				expand: true,
				options: {
					inline: true,
					context: {
						CHROME: true,
					}
				}
			}
		},
		rename: {
			firefox: {
				files: [{
					src: `${buildDir}/icons/icon128_firefox.png`,
					dest: `${buildDir}/icons/icon128.png`
				}, {
					src: `${buildDir}/icons/icon48_firefox.png`,
					dest: `${buildDir}/icons/icon48.png`
				}]
			}
		},
		replace_json: {
			chrome: {
				src: `${buildDir}/manifest.json`,
				changes: {
					'options_ui': undefined,
				}
			},
			firefox: {
				src: `${buildDir}/manifest.json`,
				changes: {
					'applications.gecko.id': amoExtensionId,
					'applications.gecko.strict_min_version': '53.0',

					'options_page': undefined,
				}
			},
		},

		/**
		 * Publish tasks.
		 */

		bump: {
			options: {
				files: [manifestFile],
				updateConfigs: ['manifest'],
				commitFiles: [manifestFile],
			}
		},
		dump_changelog: {
			token: githubConfig.token,
			version: '<%= manifest.version %>',
		},
		github_publish: {
			token: githubConfig.token,
			version: '<%= manifest.version %>',
		},
		amo_upload: {
			issuer: amoConfig.issuer,
			secret: amoConfig.secret,
			id: amoExtensionId,
			version: '<%= manifest.version %>',
			src: packageName,
		},
		webstore_upload: {
			accounts: {
				default: {
					publish: true,
					client_id: webStoreConfig.clientId,
					client_secret: webStoreConfig.clientSecret,
					refresh_token: webStoreConfig.refreshToken,
				},
			},
			extensions: {
				'web-scrobbler': {
					appID: chromeExtensionId,
					zip: packageName,
				}
			}
		},

		/**
		 * Linter configs.
		 */

		eslint: {
			target: jsFiles,
			options: {
				configFile: '.eslintrc.js',
				fix: !isTravisCi
			},
		},
		jsonlint: {
			src: jsonFiles
		},
		lintspaces: {
			src: [jsFiles, jsonFiles, cssFiles, htmlFiles],
			options: {
				editorconfig: '.editorconfig',
				ignores: ['js-comments']
			}
		},
		stylelint: {
			all: cssFiles
		},

		/**
		 * Configs of other tasks.
		 */

		exec: {
			run_tests: {
				cmd: (...args) => `node tests/runner.js ${args.join(' ')}`
			}
		},
		gitcommit: {
			add0n_changelog: {
				options: {
					message: 'Update changelog on add0n.com'
				},
				files: {
					src: ['.add0n/changelog.json']
				}
			}
		}
	});

	require('load-grunt-tasks')(grunt);
	grunt.loadTasks('.grunt');

	/**
	 * Some tasks take browser name as an argument.
	 * We support only Chrome and Firefox, which can be specified
	 * as 'chrome' and 'firefox' respectively:
	 *
	 *   Build a package for Chrome browser
	 *   > grunt build:chrome
	 *
	 *   Compile sources for Firefox browser
	 *   > grunt compile:firefox
	 */

	/**
	 * Set the extension icon according to specified browser.
	 * @param {String} browser Browser name
	 */
	grunt.registerTask('icons', (browser) => {
		assertBrowserIsSupported(browser);

		switch (browser) {
			case 'chrome':
				grunt.task.run('clean:chrome');
				break;
			case 'firefox':
				grunt.task.run('rename:firefox');
				break;
		}
	});

	/**
	 * Copy source filed to build directory, preprocess them and
	 * set the extension icon according to specified browser.
	 * @param {String} browser Browser name
	 */
	grunt.registerTask('compile', (browser) => {
		assertBrowserIsSupported(browser);

		grunt.task.run([
			'copy', `preprocess:${browser}`,
			`icons:${browser}`, 'imagemin',
			`replace_json:${browser}`
		]);
	});

	/**
	 * Compile source files and package them.
	 * @param  {String} browser Browser name
	 */
	grunt.registerTask('build', (browser) => {
		assertBrowserIsSupported(browser);

		grunt.task.run([
			'clean:build', `compile:${browser}`, 'clean:package',
			'compress', 'clean:build',
		]);
	});

	/**
	 * Publish data.
	 * @param  {String} arg Task argument
	 */
	grunt.registerTask('publish', (arg) => {
		/**
		 * Generate and commit changelog file for add0n.com website.
		 */
		if (arg === 'add0n' || arg === 'addon') {
			grunt.task.run([
				'dump_changelog', 'gitcommit:add0n_changelog'
			]);
			return;
		}

		if (arg === 'github') {
			grunt.task.run('github_publish');
			return;
		}

		/**
		 * Create package and publish it.
		 */

		let browser = arg;
		assertBrowserIsSupported(browser);

		switch (browser) {
			case 'chrome':
				grunt.task.run(['build:chrome', 'webstore_upload', 'clean:package']);
				break;
			case 'firefox':
				grunt.task.run(['build:firefox', 'amo_upload', 'clean:package']);
				break;
		}
	});

	/**
	 * Release new version for CI to pickup.
	 *
	 * @param {String} releaseType Release type that 'grunt-bump' supports
	 */
	grunt.registerTask('release', (releaseType) => {
		if (!releaseType) {
			grunt.fail.fatal('You should specify release type!');
		}

		grunt.task.run(`bump-only:${releaseType}`);
		grunt.task.run('bump-commit');
	});


	/**
	 * Release new version locally and publish all packages.
	 *
	 * @param {String} releaseType Release type that 'grunt-bump' supports
	 */
	grunt.registerTask('release-local', (releaseType) => {
		if (!releaseType) {
			grunt.fail.fatal('You should specify release type!');
		}

		// Patch releases are in vX.X.X branch, so there's no reason
		// to make changelogs for them.
		if (releaseType !== 'patch') {
			grunt.task.run('publish:add0n');
		}

		grunt.task.run(`release:${releaseType}`);

		grunt.task.run(['publish:chrome', 'publish:firefox']);
	});

	/**
	 * Run core or connectors tests.
	 *
	 * You can easily run all test by the following command:
	 *   > grunt test
	 *
	 * To run core tests use 'core' as an argument:
	 *   > grunt test:core
	 *
	 * Note: running core and connectors tests at the same time is not supported.
	 *
	 * You can specify tests you want to run as arguments:
	 *   > grunt test:8tracks
	 *   Run single test for 8tracks connector
	 *
	 *   > grunt test:hypem:dashradio
	 *   Run tests for Hype Machine and Dash Radio connectors
	 *
	 * Also, you can use following options:
	 *   - debug: enable debug mode. Disabled by default.
	 *     Use true|on|1 value to enable and false|off|0 to disable debug mode.
	 *   - quitOnEnd: close browser when all tests are completed. Enabled by default.
	 *     Use true|on|1 value to enable and false|off|0 to disable this feature.
	 *   - skip: skip given tests.
	 *     Tests can be specified as string of tests filenames joined by comma.
	 *
	 * Of course, you can mix both options and tests in arguments:
	 *   > grunt test:8tracks:debug=1
	 */
	grunt.registerTask('test', 'Run tests.', function(...args) {
		grunt.task.run([
			`exec:run_tests:${args.join(':')}`
		]);
	});

	/**
	 * Lint source code using linters specified below.
	 */
	grunt.registerTask('lint', [
		'eslint', 'jsonlint', 'lintspaces', 'stylelint'
	]);

	/**
	 * Register default task
	 */
	grunt.registerTask('default', ['lint', 'test:core']);

	/**
	 * Throw an error if the extension doesn't support given browser.
	 * @param  {String}  browser Browser name
	 */
	function assertBrowserIsSupported(browser) {
		const supportedBrowsers = ['chrome', 'firefox'];

		if (!browser) {
			grunt.fail.fatal(
				'You have not specified browser.\n' +
				`Currently supported browsers: ${supportedBrowsers.join(', ')}.`
			);
		}

		if (supportedBrowsers.indexOf(browser) === -1) {
			grunt.fail.fatal(`Unknown browser: ${browser}`);
		}
	}

	/**
	 * Get JSON config.
	 *
	 * @param  {String} configPath Path to config file
	 * @return {Object} Config object
	 */
	function loadConfig(configPath) {
		if (fs.existsSync(configPath)) {
			return require(configPath);
		}

		return {};
	}

	/**
	 * Get web store config.
	 *
	 * @return {Object} Config object
	 */
	function loadWebStoreConfig() {
		if (isTravisCi) {
			let webStoreConfig =  {
				clientId: process.env.CHROME_CLIENT_ID,
				clientSecret: process.env.CHROME_CLIENT_SECRET,
				refreshToken: process.env.CHROME_REFRESH_TOKEN
			};

			return webStoreConfig;
		}

		let webStoreConfig = loadConfig('./.publish/web-store.json');

		return webStoreConfig;
	}

	/**
	 * Get github config.
	 *
	 * @return {Object} Config object
	 */
	function loadGithubConfig() {
		if (isTravisCi) {
			let githubConfig =  {
				token: process.env.GITHUB_TOKEN,
			};

			return githubConfig;
		}

		let githubConfig = loadConfig('./.publish/github.json');

		return githubConfig;
	}

	/**
	 * Get Amo config.
	 *
	 * @return {Object} Config object
	 */
	function loadAmoConfig() {
		if (isTravisCi) {
			let amoConfig =  {
				issuer: process.env.AMO_ISSUER,
				secret: process.env.AMO_SECRET,
			};

			return amoConfig;
		}

		let amoConfig = loadConfig('./.publish/amo.json');

		return amoConfig;
	}
};
