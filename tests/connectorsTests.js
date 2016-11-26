'use strict';

require('node-define');

const RETRIES_COUNT = 5;

const fs = require('fs');
const path = require('path');
const async = require('async');
const helpers = require('./helpers/helpers');

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
	var connectors = getConnectorsList();
	var connectorsFromArgs = helpers.getConnectorsFromArgs();
	if (connectorsFromArgs.length > 0) {
		var invalidConnectors = [];

		connectors = connectors.filter(function(item) {
			var connectorFileName = path.basename(item.js[0], '.js');
			var fileNameIndex = connectorsFromArgs.indexOf(connectorFileName);
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

	return connectors;
}

function getTestDescription(connector) {
	var filename = path.basename(connector.js[0], '.js');
	if (global.DEBUG) {
		return `Connector: ${filename}`;
	} else {
		return `[${filename}]`;
	}
}

function prepareTest(connector, driver, connectorSpec) {
	var testDescription = getTestDescription(connector);
	describe(testDescription, function() {
		if (!global.DEBUG) {
			this.retries(RETRIES_COUNT);
		}

		var connectorFilePath = getConnectorTestFilePath(connector);
		require(connectorFilePath)(driver, connectorSpec, connector);
	});
}

function runConnectorsTests() {
	var connectors = getConnectorsToTest();
	if (connectors.length > 0) {
		var driver = require('./helpers/webdriver-wrapper');
		var connectorSpec = require('./components/connector-spec.js');

		// This code DOESN'T run tests immediately.
		async.each(connectors, function(connector) {
			prepareTest(connector, driver, connectorSpec);
		});

		after(function() {
			return driver.quit();
		});
	}
}

runConnectorsTests();
