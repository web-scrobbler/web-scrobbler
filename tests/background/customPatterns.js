'use strict';

const expect = require('chai').expect;
const CustomPatterns = require('../../src/core/background/storage/custom-patterns');

/**
 * Run all tests.
 */
function runTests() {
	it('should return no patterns', (done) => {
		CustomPatterns.getAllPatterns().then((data) => {
			expect({}).to.be.deep.equal(data);
			done();
		});
	});

	it('should set patterns for connector', (done) => {
		let patterns = ['1', '2'];
		let expectedData = {
			connector: patterns
		};
		CustomPatterns.setPatterns('connector', patterns).then(() => {
			CustomPatterns.getAllPatterns().then((data) => {
				expect(expectedData).to.be.deep.equal(data);
				done();
			});
		});
	});

	it('should clear custom patterns', (done) => {
		CustomPatterns.resetPatterns('connector').then(() => {
			CustomPatterns.getAllPatterns().then((data) => {
				expect({}).to.be.deep.equal(data);
				done();
			});
		});
	});
}

runTests();
