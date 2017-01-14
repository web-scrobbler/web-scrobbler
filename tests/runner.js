'use strict';

const path = require('path');
const Mocha = require('mocha');
const options = require('./helpers/options');
const requirejs = require('node-define');

function configureRequireJs() {
	requirejs.config({
		paths: {
			wrappers: 'tests/stubs/'
		},
		waitSeconds: 0
	});
}

function getTestReporter() {
	if (options.getTestMode() === 'core') {
		return 'spec';
	}

	return options.get('debug') ? 'spec' : 'tap';
}

function createMocha() {
	var mocha = new Mocha({
		timeout: 120000,
		reporter: getTestReporter()
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
	configureRequireJs();
	createMocha().run(function(failures) {
		process.on('exit', function () {
			process.exit(failures);
		});
	});
}

main();
