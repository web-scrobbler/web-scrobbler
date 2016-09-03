'use strict';

require('node-define');

const RETRIES_COUNT = 5;

const fs = require('fs');
const path = require('path');
const async = require('async');

global.connectorSpec = require('./components/connector');
global.expect = require('chai').expect;

function getConnectorTestFilePath(connector) {
	var testFileName = path.basename(connector.js[0]);
	return path.join(__dirname, 'connectors', testFileName);
}

function getConnectorsList() {
	var connectors = require('../core/connectors');
	var uniqueConnectors = [];
	return connectors.filter(function(item) {
		var filePath = getConnectorTestFilePath(item);
		if (uniqueConnectors.indexOf(filePath) != -1) {
			return false;
		}
		uniqueConnectors.push(filePath);
		return true;
	}).sort(function(a, b) {
		return a.label.localeCompare(b.label);
	});
}

function getConnectorsToTest() {
	var connectors = getConnectorsList();
	var connectorsArgs = process.argv.slice(2);
	if (connectorsArgs.length > 0) {
		var invalidConnectors = [];

		connectorsArgs = connectorsArgs.filter(function(item) {
			var filePath = path.join(__dirname, 'connectors', item + '.js');
			if (!fs.existsSync(filePath)) {
				invalidConnectors.push(item);
				return false;
			}
			return true;
		});

		connectors = connectors.filter(function(item) {
			var connectorFileName = path.basename(item.js[0], '.js');
			var fileNameIndex = connectorsArgs.indexOf(connectorFileName);
			if (fileNameIndex !== -1) {
				connectorsArgs.splice(fileNameIndex, 1);
				return true;
			}
			return false;
		});

		invalidConnectors = invalidConnectors.concat(connectorsArgs);
		if (invalidConnectors.length > 0) {
			console.warn('Unknown connectors: ' + invalidConnectors.join(', '));
		}
	}

	return connectors;
}

function getTestDescription(connector) {
	var connectorLabel = connector.label;
	if (global.DEBUG) {
		return 'Connector: ' + connectorLabel;
	} else {
		if (connectorLabel.length > 20) {
			connectorLabel = connectorLabel.substring(0, 20) + '…';
		}
		return '[' + connectorLabel + ']';
	}
}

function testConnector(driver, connector, callback) {
	var testDescription = getTestDescription(connector);
	describe(testDescription, function() {
		var connectorFilePath = getConnectorTestFilePath(connector);
		if (fs.existsSync(connectorFilePath)) {
			require(connectorFilePath)(driver, connector);
		}

		after(function() {
			callback();
		});
	});
}

function runConnectorsTests() {
	var connectors = getConnectorsToTest();
	if (connectors.length > 0) {
		var driver = require('./helpers/chromeSpoofing').getDriver();

		describe('', function() {
			this.retries(RETRIES_COUNT);

			async.each(connectors, function(connector, callback) {
				testConnector(driver, connector, function() {
					callback();
				});
			});

			after(function() {
				driver.quit();
			});
		});
	}
}

runConnectorsTests();
