'use strict';

/**
 * This runner executes tests of the extension core.
 * These tests are placed into 'core' directory.
 */

const fs = require('fs');
const path = require('path');

/**
 * Get full path to test module.
 * @param  {String} module Module filename
 * @return {String} Path to module
 */
function getCoreTestFilePath(module) {
	let testFileName = path.basename(module);
	return path.join(__dirname, 'core', testFileName);
}

/**
 * Get description of given test module.
 * @param  {String} modulePath Path to module
 * @return {String} Test description
 */
function getTestDescription(modulePath) {
	let moduleName = path.basename(modulePath, '.js');
	return `'${moduleName}' module`;
}

/**
 * Queue test. This function does not run test immediately.
 * @param  {String} modulePath Path to module
 */
function queueTest(modulePath) {
	let testDescription = getTestDescription(modulePath);
	describe(testDescription, () => {
		let fullTestPath = getCoreTestFilePath(modulePath);
		require(fullTestPath)();
	});
}

/**
 * Run all core tests. Called on module init.
 */
function runCoreTests() {
	let coreTestsDir = path.join(__dirname, 'core');
	let testFiles = fs.readdirSync(coreTestsDir);

	for (let testFile of testFiles) {
		queueTest(testFile);
	}
}

runCoreTests();
