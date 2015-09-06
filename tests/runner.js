'use strict';

/* globals __filename, process */

require('selenium-chromedriver');
var Mocha = require('mocha');
var getPath = require('./helpers.js').getPath;

// To run specific tests add to Mocha object: grep: /{PATTERN}/
var mocha = new Mocha({
	timeout: 120000,
	title: 'Connector tests',
	ui: 'mocha-retry'
	// grep: /skipthemall/
});

mocha.addFile(getPath(__filename, '/connectorSpec.js'));

mocha.run(function(failures) {
	process.on('exit', function () {
		process.exit(failures);
	});
});
