'use strict';

/**
 * Enable to verbose unittests output
 * @type {Boolean}
 */
global.DEBUG = false;
global.helpers = require('./helpers/helpers.js');

const path = require('path');
var Mocha = require('mocha');

var mocha = new Mocha({
	timeout: 120000,
	title: 'Connector tests'
});

mocha.addFile(path.join(__dirname, 'connectorsTests.js'));

mocha.run(function(failures) {
	process.on('exit', function () {
		process.exit(failures);
	});
});
