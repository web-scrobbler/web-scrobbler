'use strict';

const fs = require('fs');
const path = require('path');

const expect = require('chai').expect;
const connectors = require('../../src/core/connectors');

const PROP_TYPES = {
	allFrames: 'boolean',
	matches: 'array',
	label: 'string',
	js: 'array',
};
const REQUIRED_PROPS = ['label', 'js'];

function testProps(entry) {
	for (const prop of REQUIRED_PROPS) {
		if (!entry[prop]) {
			throw new Error(`Missing property: ${prop}`);
		}
	}

	for (const prop in entry) {
		const type = PROP_TYPES[prop];
		if (!type) {
			throw new Error(`Unknown property: ${prop}`);
		}

		expect(entry[prop]).to.be.a(type);
	}
}

function testPaths(entry) {
	if (!entry.js) {
		throw new Error('Missing property: js');
	}

	if (!Array.isArray(entry.js)) {
		throw new Error('Invalid property type: js');
	}

	for (const f of entry.js) {
		const jsPath = path.join(__dirname, '../../src', f);
		try {
			fs.statSync(jsPath);
		} catch (e) {
			throw new Error(`File is missing: ${f}`);
		}
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
	}
}

runTests();
