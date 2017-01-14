'use strict';

const path = require('path');
const Mocha = require('mocha');
const options = require('./helpers/options');

function createMocha() {
	var mocha = new Mocha({
		timeout: 120000,
		reporter: options.get('debug') ? 'spec' : 'tap'
	});
	switch (options.getTestMode()) {
		case 'core':
			mocha.addFile(path.join(__dirname, 'coreTests.js'));
			break;
		case 'connectors':
			mocha.addFile(path.join(__dirname, 'connectorsTests.js'));
			break;
	}
	return mocha;
}

function main() {
	createMocha().run(function(failures) {
		process.on('exit', function () {
			process.exit(failures);
		});
	});
}

main();
