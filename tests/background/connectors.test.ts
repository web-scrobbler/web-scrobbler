import fs from 'fs';
import path from 'path';

import { expect, assert, describe, it } from 'vitest';

import connectors, { ConnectorMeta } from '@/core/connectors';
import * as UrlMatch from '@/util/url-match';

const PROP_TYPES: {
	allFrames: 'boolean';
	matches: 'array';
	label: 'string';
	js: 'string';
	id: 'string';
} = {
	allFrames: 'boolean',
	matches: 'array',
	label: 'string',
	js: 'string',
	id: 'string',
};
const REQUIRED_PROPS: ['label', 'js', 'id'] = ['label', 'js', 'id'];

function testProps(entry: ConnectorMeta) {
	for (const prop of REQUIRED_PROPS) {
		assert(entry[prop], `Missing property: ${prop}`);
	}

	for (const _prop in entry) {
		const prop = _prop as keyof ConnectorMeta;
		const type = PROP_TYPES[prop];

		assert(type, `Missing property: ${prop}`);
		expect(entry[prop]).to.be.a(type);
	}
}

function testMatches(entry: ConnectorMeta) {
	if (!entry.matches) {
		return;
	}

	assert(entry.matches.length !== 0, 'Property is empty: matches');

	for (const m of entry.matches) {
		assert(UrlMatch.createPattern(m), `URL pattern is invalid: ${m}`);
	}
}

function testPaths(entry: ConnectorMeta) {
	if (!entry.js) {
		return;
	}

	const jsPath = path.join(
		__dirname,
		'../../src/connectors',
		entry.js.replace('.js', '.ts'),
	);
	try {
		fs.statSync(jsPath);
	} catch (e) {
		throw new Error(`File is missing: ${entry.js}`);
	}
}

function testUniqueness(entry: ConnectorMeta) {
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
