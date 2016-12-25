'use strict';

require('node-define');
const fs = require('fs');
const path = require('path');

const IGNORED_FILES = [
	'soundcloud-dom-inject.js', 'vk-dom-inject.js',
];

const extensionDir = path.join(__dirname, '..');

function getConnectorsList() {
	let connectorsDir = path.join(extensionDir, 'connectors', 'v2');
	return fs.readdirSync(connectorsDir).map(filename => {
		return filename.split('/').pop();
	});
}

function getTestsList() {
	let testsDir = path.join(extensionDir, 'tests', 'connectors');
	return fs.readdirSync(testsDir).map(filename => {
		return filename.split('/').pop();
	});
}

function getArrayDiff(arr1, arr2) {
	return arr1.filter(item => {
		return arr2.indexOf(item) === -1;
	}).filter(filename => {
		return IGNORED_FILES.indexOf(filename) === -1;
	});
}

function printArrayItems(arr, desc) {
	if (arr.length) {
		console.info(`${desc} [${arr.length}]:`);
		arr.sort().forEach(item => {
			console.info(' *', item);
		});
	}
}

function printTestsInfo() {
	let tests = getTestsList();
	let connectors = getConnectorsList();

	let missingTests = getArrayDiff(connectors, tests);
	let unusedTests = getArrayDiff(tests, connectors);

	printArrayItems(missingTests, 'Missing tests');
	printArrayItems(unusedTests, 'Unused tests');
}

printTestsInfo();
