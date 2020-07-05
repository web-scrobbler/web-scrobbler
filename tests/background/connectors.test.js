import fs from 'fs';
import path from 'path';

import { expect, assert } from 'chai';

import connectors from '@/connectors.json';
import { createPattern } from '@/background/util/url-match';

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

function testMatches(entry) {
	if (!entry.matches) {
		return;
	}

	assert(entry.matches !== 0, 'Property is empty: matches');

	for (const m of entry.matches) {
		assert(createPattern(m), `URL pattern is invalid: ${m}`);
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
		describe(entry.label, () => {
			it('should have valid prop types', () => {
				testProps(entry);
			});

			it('should have valid URL matches', () => {
				testMatches(entry);
			});

			it('should have js files for', () => {
				testPaths(entry);
			});

			it('should have unique id', () => {
				testUniqueness(entry);
			});
		});
	}
}

runTests();
