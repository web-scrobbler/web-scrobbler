'use strict';

const fs = require('fs');
const path = require('path');
const options = require('./helpers/options');

function getCoreTestFilePath(coreModule) {
	let testFileName = path.basename(coreModule);
	return path.join(__dirname, 'core', testFileName);
}

function getTestDescription(moduleFile) {
	let moduleName = path.basename(moduleFile, '.js');
	if (options.get('debug')) {
		return `Module: ${moduleName}`;
	} else {
		return `[${moduleName}]`;
	}
}

function queueTest(coreModule) {
	let testDescription = getTestDescription(coreModule);
	describe(testDescription, () => {
		let fullTestPath = getCoreTestFilePath(coreModule);
		require(fullTestPath)();
	});
}

function runCoreTests() {
	let coreTestsDir = path.join(__dirname, 'core');
	let testFiles = fs.readdirSync(coreTestsDir);

	for (let testFile of testFiles) {
		queueTest(testFile);
	}
}

runCoreTests();
