import { statSync } from 'fs';
import { join } from 'path';

import { expect } from 'chai';

import connectors from '@/connectors.json';
import { createPattern } from '@/background/util/url-match';
import { ConnectorEntry } from '@/common/connector-entry';

function testUrlPatterns(entry: ConnectorEntry) {
	if (!entry.matches) {
		return;
	}

	for (const urlPattern of entry.matches) {
		expect(createPattern(urlPattern)).to.be.instanceof(
			RegExp,
			`URL pattern is invalid: ${urlPattern}`
		);
	}
}

function testConnectorPaths(entry: ConnectorEntry) {
	if (!entry.js) {
		return;
	}

	const jsPath = join(__dirname, '../src', entry.js);
	try {
		statSync(jsPath);
	} catch (e) {
		throw new Error(`File is missing: ${entry.js}`);
	}
}

function testIdUniqueness(entry: ConnectorEntry) {
	for (const connector of connectors) {
		if (connector.label === entry.label) {
			continue;
		}

		expect(entry.id).to.be.not.equal(
			connector.id,
			`ID is not unique: ${entry.label}`
		);
	}
}

describe('connectors.json', () => {
	for (const entry of connectors) {
		describe(entry.label, () => {
			it('should have valid URL patterns', () => {
				testUrlPatterns(entry);
			});

			it('should have connector JS file', () => {
				testConnectorPaths(entry);
			});

			it('should have unique ID', () => {
				testIdUniqueness(entry);
			});
		});
	}
});
