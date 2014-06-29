'use strict';

/* global module, require */
module.exports = function(grunt) {

	var jsFiles = ['Gruntfile.js', 'core/background/*', 'core/content/*', 'options/options.js', 'connectors/archive.js'];// intentionally does not contain all files yet

	grunt.initConfig({
		jshint: {
			all: jsFiles,
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
				src: ['*.*', 'connectors/**', 'options/**', 'vendor/**']
			}
		},
		lintspaces: {
			all: {
				src: [
					jsFiles
				],

				options: {
					editorconfig: '.editorconfig',
					ignores: [
						'js-comments'
					]
				}
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-lintspaces');
	grunt.registerTask('lint', ['jshint']);
	grunt.registerTask('default', ['lint', 'lintspaces']);
};
