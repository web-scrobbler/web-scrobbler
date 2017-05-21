'use strict';

/**
 * This runner executes tests of the extension connectors.
 * These tests are placed into 'connectors' directory.
 */

require('node-define');

const RETRIES_COUNT = 4;

const fs = require('fs');
const path = require('path');
const options = require('./helpers/options');

/**
 * Get full path to test module.
 * @param  {Object} connector Connector match object
 * @return {String} Path to module
 */
function getConnectorTestFilePath(connector) {
	let testFileName = path.basename(connector.js[0]);
	return path.join(__dirname, 'connectors', testFileName);
}

/**
 * Get list of supported connectors. The list is sorted alphabetically.
 * @return {Array} List of connectors
 */
function getConnectorsList() {
	let connectors = require('../core/connectors');
	let uniqueConnectors = [];
	return connectors.filter((item) => {
		let testFilePath = getConnectorTestFilePath(item);
		if (!fs.existsSync(testFilePath)) {
			return false;
		}

		if (uniqueConnectors.includes(testFilePath)) {
			return false;
		}
		uniqueConnectors.push(testFilePath);
		return true;
	}).sort((a, b) => a.js[0].localeCompare(b.js[0]));
}

/**
 * Get list of connectors to test. This list contains:
 *  - connectors have test modules;
 *  - connectors are specified by user.
 * @return {Array} List of connectors
 */
function getConnectorsToTest() {
	let connectors = getConnectorsList();
	let connectorsFromArgs = options.getConnectorsFromArgs();
	let skipList = options.get('skip');

	if (connectorsFromArgs.length > 0) {
		let invalidConnectors = [];

		connectors = connectors.filter((connector) => {
			let connectorName = getConnectorName(connector);
			let fileNameIndex = connectorsFromArgs.indexOf(connectorName);
			if (fileNameIndex !== -1) {
				connectorsFromArgs.splice(fileNameIndex, 1);
				return true;
			}

			return false;
		});

		invalidConnectors = invalidConnectors.concat(connectorsFromArgs);
		if (invalidConnectors.length > 0) {
			console.warn('Unknown connectors: ' + invalidConnectors.join(', '));
		}
	}

	if (skipList.length > 0) {
		connectors = connectors.filter((connector) => {
			let connectorName = getConnectorName(connector);
			return !skipList.includes(connectorName);
		});
	}

	return connectors;
}

/**
 * Get description of test module for given connector.
 * @param  {Object} connector Connector match object
 * @return {String} Test description
 */
function getTestDescription(connector) {
	let filename = getConnectorName(connector);
	if (options.get('debug')) {
		return `Connector: ${filename}`;
	}

	return `[${filename}]`;
}

/**
 * Queue test. This function does not run test immediately.
 * @param  {Object} connector Connector match object
 * @param  {Object} driver WebDriver instance
 * @param  {Object} connectorSpec
 */
function prepareTest(connector, driver, connectorSpec) {
	let testDescription = getTestDescription(connector);
	describe(testDescription, function() {
		if (!options.get('debug')) {
			this.retries(RETRIES_COUNT);
		}

		let connectorFilePath = getConnectorTestFilePath(connector);
		require(connectorFilePath)(driver, connectorSpec, connector);
	});
}

/**
 * Get connector filename.
 * @param  {Object} connector Connector match object
 * @return {String} Connector filename
 */
function getConnectorName(connector) {
	return path.basename(connector.js[0], '.js');
}

/**
 * Run all core tests. Called on module init.
 */
function runConnectorsTests() {
	let connectors = getConnectorsToTest();

	if (connectors.length > 0) {
		let driver = require('./helpers/webdriver-wrapper');
		let connectorSpec = require('./components/connector-spec.js');

		// This code DOESN'T run tests immediately.
		for (let connector of connectors) {
			prepareTest(connector, driver, connectorSpec);
		}

		after(() => {
			if (options.get('quitOnEnd')) {
				return driver.quit();
			}
		});
	}
}

runConnectorsTests();
