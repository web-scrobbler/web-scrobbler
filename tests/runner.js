'use strict';

/**
 * Enable to verbose unittests output
 * @type {Boolean}
 */
global.DEBUG = false;

var helpers = global.helpers = require('./helpers/helpers.js');
var Mocha = require('mocha');

// To run specific tests add to Mocha object: grep: /{PATTERN}/
var mocha = new Mocha({
	timeout: 120000,
	title: 'Connector tests'
});

mocha.addFile(helpers.getPath(__filename, '/connectorsTests.js'));

mocha.run(function(failures) {
	process.on('exit', function () {
		process.exit(failures);
	});
});
