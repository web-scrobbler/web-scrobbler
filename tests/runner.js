'use strict';

/**
 * Enable to verbose unittests output
 * @type {Boolean}
 */
global.DEBUG = false;

const path = require('path');
const Mocha = require('mocha');

function createMocha() {
	var mocha = new Mocha({
		timeout: 120000,
		reporter: global.DEBUG ? 'spec' : 'tap'
	});
	mocha.addFile(path.join(__dirname, 'connectorsTests.js'));
	return mocha;
}

createMocha().run(function(failures) {
	process.on('exit', function () {
		process.exit(failures);
	});
});
