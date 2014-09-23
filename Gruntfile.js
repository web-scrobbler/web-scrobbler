'use strict';

/* global module, require */
module.exports = function(grunt) {

	var jsFiles = ['Gruntfile.js', 'popup.js', 'core/background/*', 'core/content/*', 'options/options.js', 'connectors/archive.js', 'connectors/bandcamp.js', 'connectors/blinkboxmusic.js', 'connectors/ambientsleepingpill.js', 'popups/*.js']; // intentionally does not contain all files yet
	var cssFiles = ['options/options.css', 'popups/base.css', 'dialogs/base.css'];

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
					jsFiles, cssFiles
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
