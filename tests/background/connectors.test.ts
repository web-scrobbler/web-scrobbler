import * as fs from 'fs';
import * as path from 'path';

import { expect, describe, it } from '@jest/globals';
import { getType } from '@jest/get-type';

import type { ConnectorMeta } from '@/core/connectors';
import connectors from '@/core/connectors';
import * as UrlMatch from '@/util/url-match';

const PROP_TYPES = {
	usesBlocklist: 'boolean',
	hasNativeScrobbler: 'boolean',
	allFrames: 'boolean',
	matches: 'array',
	label: 'string',
	js: 'string',
	id: 'string',
} as const;
const REQUIRED_PROPS = ['label', 'js', 'id'] as const;

function testProps(entry: ConnectorMeta) {
	for (const prop of REQUIRED_PROPS) {
		expect(entry[prop]).toBeTruthy();
	}

	for (const _prop in entry) {
		const prop = _prop as keyof ConnectorMeta;
		const type = PROP_TYPES[prop];

		expect(type).toBeTruthy();
		expect(getType(entry[prop])).toEqual(type);
	}
}

function testMatches(entry: ConnectorMeta) {
	if (!entry.matches) {
		return;
	}

	expect(entry.matches.length !== 0).toBeTruthy();

	for (const m of entry.matches) {
		expect(UrlMatch.createPattern(m)).toBeTruthy();
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
	} catch {
		throw new Error(`File is missing: ${entry.js}`);
	}
}

function testUniqueness(entry: ConnectorMeta) {
	const firstConnectorWithId = connectors.find(
		(connector) => connector.id === entry.id,
	);
	expect(firstConnectorWithId).toEqual(entry);
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
