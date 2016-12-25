'use strict';

const path = require('path');
const Mocha = require('mocha');
const options = require('./helpers/options');

function getTestMode() {
	let args = process.argv.slice(2);
	if (args.length === 1 && args[0] === 'core') {
		return 'core';
	}
	return 'connectors';
}

function createMocha() {
	var mocha = new Mocha({
		timeout: 120000,
		reporter: options.get('debug') ? 'spec' : 'tap'
	});
	switch (getTestMode()) {
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
