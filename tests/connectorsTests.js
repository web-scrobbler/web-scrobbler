'use strict';

require('node-define');

var fs = require('fs');
var path = require('path');
var driver = require('./helpers/chromeSpoofing').getDriver();

var async = global.async = require('async');
global.connectorSpec = require('./components/connector');
global.expect = require('chai').expect;

function getConnectorTestFilePath(connector) {
	var testFileName = path.basename(connector.js[0]);
	return path.join(__dirname, 'connectors', testFileName);
}

function getConnectorsList() {
	var connectors = require('../core/connectors');
	var uniqueConnectors = [];
	var sortedConnectors = connectors.filter(function(item) {
		var filePath = getConnectorTestFilePath(item);
		if (uniqueConnectors.indexOf(filePath) != -1) {
			return false;
		}
		uniqueConnectors.push(filePath);
		return true;
	}).sort(function(a, b) {
		return a.label.localeCompare(b.label);
	});

	return sortedConnectors;
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

function testConnector(connector, callback) {
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
	describe('', function() {
		var connectors = getConnectorsList();
		async.each(connectors, function(connector, callback) {
			testConnector(connector, function() {
				callback();
			});
		});

		after(function() {
			driver.quit();
		});
	});
}

runConnectorsTests();
