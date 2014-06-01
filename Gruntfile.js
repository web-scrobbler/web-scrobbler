'use strict';

/* global module, require */
module.exports = function(grunt) {

	grunt.initConfig({
		jshint: {
			all: ['Gruntfile.js', 'defines.js', 'connectors/archive.js', 'connectors/bleep.js'], // intentionally does not contain all files yet
			options: {
				jshintrc: true,
				reporter: require('jshint-stylish')
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('lint', ['jshint']);
	grunt.registerTask('default', ['lint']);
};