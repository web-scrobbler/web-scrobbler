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

describe('Web-Scrobbler Extension', function() {
	before(function(done) {
		driver.sleep(1000).then(function() {
			done();
		});
	});

	var connectors = getConnectorsList();

	/**
	 * Loop through all the connectors currently enabled,
	 * look for explicitly defined tests first,
	 * falling back to a generic test if none are found.
	*/
	async.each(connectors, function(connector, next) {
		describe('Connector: ' + connector.label, function() {
			var connectorFilePath = getConnectorTestFilePath(connector);
			if (fs.existsSync(connectorFilePath)) {
				require(connectorFilePath)(driver, connector, next);
			} else {
				// Generic test here - will rely on a defined test URL for each connector
				// it('has no tests', function() {});
				next();
			}
		});
	});

	after(function() {
		driver.quit();
	});
});
