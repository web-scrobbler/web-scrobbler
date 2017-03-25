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
	const jsonFiles = ['*.json', '.jshintrc', '.csslintrc'];
	const htmlFiles = ['options/*.html', 'popups/*.html', 'dialogs/**/*.html'];
	const cssFiles = [
		'options/options.css', 'popups/go_play_music.css',
		'popups/error.css', 'dialogs/base.css'
	];

	const extensionSources = [
		'connectors/**', 'core/**', 'dialogs/**',
		'icons/**', 'options/**', 'popups/**', 'vendor/**',
		'manifest.json', 'README.md', 'LICENSE.txt',
		// Skip files
		'!core/content/testReporter.js'
	];
	const buildDir = 'build';
	const packageName = 'web-scrobbler.zip';

	grunt.initConfig({
		/**
		 * Configs of build tasks.
		 */

		clean: {
			build: buildDir,
			package: packageName
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

		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			src: cssFiles
		},
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
			publish_cws: {
				cmd: `node scripts/publish-cws ${packageName}`
			},
			run_tests: {
				cmd: (...args) => `node tests/runner.js ${args.join(' ')}`
			}
		},
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
