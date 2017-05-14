'use strict';

module.exports = function(grunt) {
	let isTravisCi = (process.env.TRAVIS === 'true');

	const jsFiles = [
		// Connectors
		'connectors/**/*.js',
		// Core files
		'*.js', 'core/**/*.js', 'options/*.js', 'popups/*.js',
		// Scripts
		'scripts/*.js',
		// Tests
		'tests/**/*.js'
	];
	const jsonFiles = ['*.json', '.stylelintrc'];
	const htmlFiles = ['options/*.html', 'popups/*.html', 'dialogs/**/*.html'];
	const cssFiles = [
		'options/options.css', 'popups/*.css', 'dialogs/base.css'
	];

	const extensionSources = [
		'connectors/**', 'core/**', 'dialogs/**',
		'icons/**', 'options/**', 'popups/**', 'vendor/**',
		'manifest.json', 'README.md', 'LICENSE.txt',
		// Skip files
		'!core/content/testReporter.js', '!icons/src/**',
	];
	const buildDir = 'build';
	const packageName = 'web-scrobbler.zip';

	grunt.initConfig({
		/**
		 * Configs of build tasks.
		 */

		clean: {
			build: buildDir,
			package: packageName,
		},
		copy: {
			project_files: {
				expand: true,
				src: extensionSources,
				dest: buildDir,
			},
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
			js_files: {
				src: `${buildDir}/**/*.js`,
				inline: true,
				expand: true
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

		bump: {
			options: {
				files: ['manifest.json'],
				commit: true,
				commitFiles: ['manifest.json'],
				push: false
			}
		},
		exec: {
			make_add0n_changelog: {
				cmd: 'node scripts/make-add0n-changelog'
			},
			publish_cws: {
				cmd: `node scripts/publish-cws ${packageName}`
			},
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

	/**
	 * Copy source files to build directory and preprocess them.
	 */
	grunt.registerTask('compile', ['copy', 'preprocess', 'imagemin']);
	/**
	 * Compile source files and package them.
	 */
	grunt.registerTask('build', [
		'clean:build', 'compile', 'clean:package', 'compress', 'clean:build'
	]);
	/**
	 * Create package and publish it to Chrome Web Store.
	 */
	grunt.registerTask('publish-cws', ['build', 'exec:publish_cws']);
	/**
	 * Release new version and publish package to Chrome Web Store.
	 * @param {String} versionType Version type that 'grunt-bump' supports
	 */
	grunt.registerTask('release', (versionType) => {
		if (!versionType) {
			grunt.fail.fatal('You should specify release type!');
		}

		grunt.task.run(`bump:${versionType}`);
		grunt.task.run('publish-cws');
	});

	/**
	 * Generate and commit changelog file for add0n.com website.
	 */
	grunt.registerTask('publish-add0n', [
		'exec:make_add0n_changelog', 'gitcommit:add0n_changelog'
	]);

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
	grunt.registerTask('default', ['lint', 'test:core']);
};
