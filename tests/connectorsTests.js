'use strict';

require('node-define');

const RETRIES_COUNT = 4;

const fs = require('fs');
const path = require('path');
const options = require('./helpers/options');

function getConnectorTestFilePath(connector) {
	var testFileName = path.basename(connector.js[0]);
	return path.join(__dirname, 'connectors', testFileName);
}

function getConnectorsList() {
	var connectors = require('../core/connectors');
	var uniqueConnectors = [];
	return connectors.filter(function(item) {
		var testFilePath = getConnectorTestFilePath(item);
		if (!fs.existsSync(testFilePath)) {
			return false;
		}

		if (uniqueConnectors.indexOf(testFilePath) !== -1) {
			return false;
		}
		uniqueConnectors.push(testFilePath);
		return true;
	}).sort(function(a, b) {
		return a.js[0].localeCompare(b.js[0]);
	});
}

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

function getTestDescription(connector) {
	var filename = getConnectorName(connector);
	if (options.get('debug')) {
		return `Connector: ${filename}`;
	}

	return `[${filename}]`;
}

function prepareTest(connector, driver, connectorSpec) {
	var testDescription = getTestDescription(connector);
	describe(testDescription, function() {
		if (!options.get('debug')) {
			this.retries(RETRIES_COUNT);
		}

		var connectorFilePath = getConnectorTestFilePath(connector);
		require(connectorFilePath)(driver, connectorSpec, connector);
	});
}

function getConnectorName(connector) {
	return path.basename(connector.js[0], '.js');
}

function runConnectorsTests() {
	let connectors = getConnectorsToTest();

	if (connectors.length > 0) {
		let driver = require('./helpers/webdriver-wrapper');
		let connectorSpec = require('./components/connector-spec.js');

		// This code DOESN'T run tests immediately.
		for (let connector of connectors) {
			prepareTest(connector, driver, connectorSpec);
		}

		after(function() {
			if (options.get('quitOnEnd')) {
				return driver.quit();
			}
		});
	}
}

runConnectorsTests();
