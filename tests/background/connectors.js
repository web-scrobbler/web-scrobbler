'use strict';

const fs = require('fs');
const path = require('path');

const expect = require('chai').expect;
const assert = require('chai').assert;

const connectors = require('../../src/core/connectors');

const PROP_TYPES = {
	allFrames: 'boolean',
	matches: 'array',
	label: 'string',
	js: 'string',
	id: 'string',
};
const REQUIRED_PROPS = ['label', 'js', 'id'];

function testProps(entry) {
	for (const prop of REQUIRED_PROPS) {
		assert(entry[prop], `Missing property: ${prop}`);
	}

	for (const prop in entry) {
		const type = PROP_TYPES[prop];

		assert(type, `Missing property: ${prop}`);
		expect(entry[prop]).to.be.a(type);
	}
}

function testPaths(entry) {
	if (!entry.js) {
		return;
	}

	const jsPath = path.join(__dirname, '../../src', entry.js);
	try {
		fs.statSync(jsPath);
	} catch (e) {
		throw new Error(`File is missing: ${entry.js}`);
	}
}

function testUniqueness(entry) {
	for (const connector of connectors) {
		if (connector.label === entry.label) {
			continue;
		}

		assert(entry.id !== connector.id, `Id is not unique: ${entry.label}`);
	}
}

function runTests() {
	for (const entry of connectors) {
		it(`should have valid properties for ${entry.label}`, () => {
			testProps(entry);
		});

		it(`should have js files for ${entry.label}`, () => {
			testPaths(entry);
		});

		it(`should have unique id ${entry.label}`, () => {
			testUniqueness(entry);
		});
	}
}

runTests();
