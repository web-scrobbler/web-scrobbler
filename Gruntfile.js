'use strict';

/* global module, require */
module.exports = function(grunt) {

	var jsConnectorFiles = ['connectors/v2/*.js']; // intentionally does not contain all files yet
	var jsCoreFiles = ['Gruntfile.js', 'core/**/*.js', 'options/options.js', 'popups/*.js'];
	var jsonFiles = ['*.json', '.jshintrc', '.csslintrc'];
	var htmlFiles = ['options/*.html', 'popups/*.html', 'dialogs/**/*.html'];
	var cssFiles = ['options/options.css', 'popups/base.css', 'dialogs/base.css'];

	grunt.initConfig({
		jshint: {
			all: [jsCoreFiles, jsConnectorFiles],
			options: {
				jshintrc: true,
				reporter: require('jshint-stylish')
			}
		},
		compress: {
			main: {
				options: {
					archive: 'web-scrobbler.zip',
					pretty: true
				},
				expand: true,
				src: [
					'connectors/**', 'core/**', 'dialogs/**',
					'icons/**', 'options/**', 'popups/**', 'vendor/**',
					'manifest.json', 'README.md', 'LICENSE.txt', '*.png'
				]
			}
		},
		lintspaces: {
			all: {
				src: [
					jsCoreFiles, jsConnectorFiles, jsonFiles, cssFiles, htmlFiles
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
		}
	});


	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-lintspaces');
	grunt.loadNpmTasks('grunt-jsonlint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.registerTask('lint', ['jshint', 'csslint', 'jsonlint', 'lintspaces']);
	grunt.registerTask('default', ['lint']);
};
