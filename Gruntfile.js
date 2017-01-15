'use strict';

module.exports = function(grunt) {
	let isTravisCi = (process.env.TRAVIS === 'true');

	var jsConnectorFiles = ['connectors/**/*.js'];
	var jsCoreFiles = ['Gruntfile.js', 'core/**/*.js', 'options/options.js', 'popups/*.js'];
	var jsTestFiles = ['tests/**/*.js'];
	var jsonFiles = ['*.json', '.jshintrc', '.csslintrc'];
	var htmlFiles = ['options/*.html', 'popups/*.html', 'dialogs/**/*.html'];
	var cssFiles = ['options/options.css', 'popups/base.css', 'popups/error.css', 'dialogs/base.css'];
	var scriptFiles = ['scripts/*.js'];

	const extensionSources = [
		'connectors/**', 'core/**', 'dialogs/**',
		'icons/**', 'options/**', 'popups/**', 'vendor/**',
		'manifest.json', 'README.md', 'LICENSE.txt', '*.png',
		// Skip files
		'!core/content/testReporter.js'
	];
	const buildDir = 'build';
	const packageName = 'web-scrobbler.zip';

	grunt.initConfig({
		bump: {
			options: {
				files: ['manifest.json'],
				commit: true,
				commitFiles: ['manifest.json'],
				push: false
			}
		},
		copy: {
			project_files: {
				expand: true,
				src: extensionSources,
				dest: buildDir,
			},
		},
		preprocess: {
			js_files: {
				src: `${buildDir}/**/*.js`,
				inline: true,
				expand: true
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
		clean: {
			build: [buildDir],
			package: [packageName]
		},
		eslint: {
			target: [jsCoreFiles, jsConnectorFiles, jsTestFiles, scriptFiles],
			options: {
				configFile: '.eslintrc.js',
				fix: !isTravisCi
			},
		},
		lintspaces: {
			all: {
				src: [
					jsCoreFiles, jsConnectorFiles, jsTestFiles,
					scriptFiles, jsonFiles, cssFiles, htmlFiles
				],
				options: {
					editorconfig: '.editorconfig',
					ignores: [
						'js-comments'
					]
				}
			}
		},
		jsonlint: {
			sample: {
				src: [ jsonFiles ]
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			strict: {
				src: [cssFiles]
			}
		},
		exec: {
			publish_cws: {
				cmd: `node scripts/publish-cws ${packageName}`
			},
			run_tests: {
				cmd: function(...args) {
					return `node tests/runner.js ${args.join(' ')}`;
				}
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	/**
	 * Copy source files to build directory and preprocess them.
	 */
	grunt.registerTask('compile', ['copy', 'preprocess']);
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
	 * @param {String} ver Version type that 'grunt-bump' supports
	 */
	grunt.registerTask('release', (ver) => {
		grunt.task.run(`bump:${ver}`);
		grunt.task.run('publish-cws');
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
	 *   - debug: Enable debug mode. Disabled by default.
	 *     Use true|on|1 value to enable debug mode and false|off|0 to disable it.
	 *   - quitOnEnd: close browser when all tests are completed. Enabled by default.
	 *     Use true|on|1 value to enable this feature and false|off|0 to disable it.
	 *
	 * Of course, you can mix both options and tests in arguments:
	 *   > grunt test:8tracks:debug=1
	 */
	grunt.registerTask('test', 'Run tests.', function(...args) {
		grunt.task.run(`exec:run_tests:${args.join(':')}`);
	});
	/**
	 * Lint source code using linters specified below.
	 */
	grunt.registerTask('lint', ['eslint', 'csslint', 'jsonlint', 'lintspaces']);
	grunt.registerTask('default', ['lint', 'test:core']);
};
