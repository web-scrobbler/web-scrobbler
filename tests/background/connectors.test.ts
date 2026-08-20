import fs from 'fs';
import path from 'path';

import { expect, assert, describe, it } from 'vitest';

import type { ConnectorMeta } from '@/core/connectors';
import connectors from '@/core/connectors';
import * as UrlMatch from '@/util/url-match';

const PROP_TYPES: {
	usesBlocklist: 'boolean';
	hasNativeScrobbler: 'boolean';
	allFrames: 'boolean';
	matches: 'array';
	label: 'string';
	js: 'string';
	id: 'string';
} = {
	usesBlocklist: 'boolean',
	hasNativeScrobbler: 'boolean',
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
	} catch {
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

function* getConnectorFiles() {
	const connectorsPath = path.join(__dirname, '../../src/connectors');
	const dir = fs.opendirSync(connectorsPath);
	const ignoredExtensions = ['.d.ts', '-dom-inject.ts'];
	while (true) {
		const dirent = dir.readSync();
		if (!dirent) {
			break;
		}
		if (!dirent.isFile() || !dirent.name.endsWith('.ts')) {
			continue;
		}
		if (ignoredExtensions.find((ext) => dirent.name.endsWith(ext))) {
			continue;
		}
		yield dirent.name;
	}
	dir.closeSync();
}

function usedByConnector(filename: string) {
	const searchname = filename.replace(/\.ts$/, '.js');
	assert(
		!!connectors.find((meta) => meta.js === searchname),
		`Connector file unused: ${filename}`,
	);
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
	for (const connectorFile of getConnectorFiles()) {
		describe(connectorFile, () => {
			it('should be used by at least one connector', () => {
				usedByConnector(connectorFile);
			});
		});
	}
}

runTests();
