'use strict';

/* global module, require */
module.exports = function(grunt) {

	grunt.initConfig({
		jshint: {
			all: ['Gruntfile.js', 'defines.js', 'inject.js', 'connectors/archive.js', 'connectors/bleep.js'], // intentionally does not contain all files yet
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
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask('lint', ['jshint']);
	grunt.registerTask('default', ['lint']);
};