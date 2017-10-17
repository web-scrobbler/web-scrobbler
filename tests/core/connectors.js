'use strict';

const expect = require('chai').expect;
const connectors = require('../../core/connectors');

const propTypes = {
	allFrames: 'boolean',
	matches: 'array',
	label: 'string',
	js: 'array',
};

function runTests() {
	for (let entry of connectors) {
		it(`should have valid properties for ${entry.label}`, () => {
			for (let prop in entry) {
				let type = propTypes[prop];
				if (!type) {
					throw new Error(`Unknown property: ${prop}`);
				}

				expect(entry[prop]).to.be.a(type);
			}
		});
	}
}

module.exports = runTests;
