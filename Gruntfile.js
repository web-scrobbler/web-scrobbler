'use strict';

/* global module, require */
module.exports = function(grunt) {

	var jsConnectorFiles = ['connectors/v2/*.js'];
	var jsCoreFiles = ['Gruntfile.js', 'core/**/*.js', 'options/options.js', 'popups/*.js'];
	var jsTestFiles = ['tests/**/*.js'];
	var jsonFiles = ['*.json', '.jshintrc', '.csslintrc'];
	var htmlFiles = ['options/*.html', 'popups/*.html', 'dialogs/**/*.html'];
	var cssFiles = ['options/options.css', 'popups/base.css', 'dialogs/base.css'];

	const extensionSources = [
		'connectors/**', 'core/**', 'dialogs/**',
		'icons/**', 'options/**', 'popups/**', 'vendor/**',
		'manifest.json', 'README.md', 'LICENSE.txt', '*.png',
		// Skip files
		'!core/content/testReporter.js'
	];
	const buildDir = 'build';

	grunt.initConfig({
		bump: {
			options: {
				files: ['manifest.json'],
				commit: true,
				commitFiles: ['manifest.json'],
				push: false
			}
		},
		jshint: {
			all: [jsCoreFiles, jsConnectorFiles, jsTestFiles],
			options: {
				jshintrc: true,
				reporter: require('jshint-stylish')
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
					archive: 'web-scrobbler.zip',
					pretty: true
				},
				expand: true,
				cwd: buildDir,
				src: '**/*',
			}
		},
		clean: [buildDir],
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

	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-lintspaces');
	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-jsonlint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-exec');

	grunt.registerTask('lint', ['jshint', 'csslint', 'jsonlint', 'lintspaces']);
	grunt.registerTask('publish', ['build', 'exec:publish']);
	grunt.registerTask('release', (ver) => {
		grunt.task.run(`bump:${ver}`);
		grunt.task.run('publish');
	});
	grunt.registerTask('test', 'Run tests.', function(...args) {
		grunt.task.run(`exec:run_tests:${args.join(':')}`);
	});
	grunt.registerTask('build', 'Build release package.', [
		'copy', 'preprocess', 'compress', 'clean'
	]);
	grunt.registerTask('default', ['lint', 'test:core']);
};
