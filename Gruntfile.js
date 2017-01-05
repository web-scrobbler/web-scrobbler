'use strict';

module.exports = function(grunt) {
	let isTravisCi = (process.env.TRAVIS === 'true');

	var jsConnectorFiles = ['connectors/v2/*.js'];
	var jsCoreFiles = ['Gruntfile.js', 'core/**/*.js', 'options/options.js', 'popups/*.js'];
	var jsTestFiles = ['tests/**/*.js'];
	var jsonFiles = ['*.json', '.jshintrc', '.csslintrc'];
	var htmlFiles = ['options/*.html', 'popups/*.html', 'dialogs/**/*.html'];
	var cssFiles = ['options/options.css', 'popups/base.css', 'popups/error.css', 'dialogs/base.css'];

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
			target: [jsCoreFiles, jsConnectorFiles, jsTestFiles],
			options: {
				configFile: '.eslintrc.js',
				fix: !isTravisCi
			},
		},
		lintspaces: {
			all: {
				src: [
					jsCoreFiles, jsConnectorFiles, jsTestFiles, jsonFiles, cssFiles, htmlFiles
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
			publish: {
				cmd: 'node scripts/publish-chrome-extension web-scrobbler.zip'
			},
			run_tests: {
				cmd: function(...args) {
					return `node tests/runner.js ${args.join(' ')}`;
				}
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('compile', ['clean:package', 'copy', 'preprocess']);
	grunt.registerTask('build', ['compile', 'compress', 'clean:build']);
	grunt.registerTask('publish', ['build', 'exec:publish']);
	grunt.registerTask('release', (ver) => {
		grunt.task.run(`bump:${ver}`);
		grunt.task.run('publish');
	});

	grunt.registerTask('test', 'Run tests.', function(...args) {
		grunt.task.run(`exec:run_tests:${args.join(':')}`);
	});
	grunt.registerTask('lint', ['eslint', 'csslint', 'jsonlint', 'lintspaces']);
	grunt.registerTask('default', ['lint', 'test:core']);
};
