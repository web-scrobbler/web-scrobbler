'use strict';

/* globals __filename, process */

global.helpers = global.thisPage = require('./helpers/helpers.js');
var Mocha = require('mocha');

// To run specific tests add to Mocha object: grep: /{PATTERN}/
var mocha = new Mocha({
	timeout: 120000,
	title: 'Connector tests'
});

mocha.addFile(helpers.getPath(__filename, '/connectorSpec.js'));

mocha.run(function(failures) {
	process.on('exit', function () {
		process.exit(failures);
	});
});
