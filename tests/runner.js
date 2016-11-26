'use strict';

/**
 * Enable to verbose unittests output
 * @type {Boolean}
 */
global.DEBUG = false;

/**
 * Close browser when tests are completed if true
 * @type {Boolean}
 */
global.QUIT_ON_END = true;

const path = require('path');
const Mocha = require('mocha');
const helpers = require('./helpers/helpers');

function createMocha() {
	var mocha = new Mocha({
		timeout: 120000,
		reporter: global.DEBUG ? 'spec' : 'tap'
	});
	mocha.addFile(path.join(__dirname, 'connectorsTests.js'));
	return mocha;
}

function processBooleanOption(key, val, option) {
	let processedVal = helpers.processOptionValue(val);
	if (processedVal !== null) {
		global[option] = processedVal;
	} else {
		console.log(`Unknown value of '${key}' option: ${val}`);
	}
}

function processOptionsFromArgs() {
	let options = helpers.getOptionsFromArgs();
	for (let key in options) {
		let val = options[key];
		switch (key) {
			case 'debug': {
				processBooleanOption(key, val, 'DEBUG');
				break;
			}
			case 'quitOnEnd': {
				processBooleanOption(key, val, 'QUIT_ON_END');
				break;
			}
			default:
				console.log(`Unknown option: ${key}`);
				break;
		}
	}
}

function main() {
	processOptionsFromArgs();
	createMocha().run(function(failures) {
		process.on('exit', function () {
			process.exit(failures);
		});
	});
}

main();
