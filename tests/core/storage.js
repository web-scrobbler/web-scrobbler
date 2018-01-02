'use strict';

/**
 * Tests for 'ChromeStorage' module.
 */

const expect = require('chai').expect;
const ChromeStorage = require('../../src/core/background/storage/chrome-storage');

/**
 * Test storage object.
 * @param  {String} type Storage type
 * @param  {Object} storage Storage instance
 */
function testStorage(type, storage) {
	describe(`${type} storage`, () => {
		it('should return empty object', () => {
			return storage.get().then((data) => {
				expect({}).to.be.deep.equal(data);
			});
		});

		it('should set key value', () => {
			let newData = { test: 'ok' };
			return storage.set(newData).then(() => {
				return storage.get();
			}).then((data) => {
				expect(newData).to.be.deep.equal(data);
			});
		});

		it('should clear storage', () => {
			return storage.clear().then(() => {
				return storage.get();
			}).then((data) => {
				expect({}).to.be.deep.equal(data);
			});
		});
	});
}

/**
 * Run all tests.
 */
function runTests() {
	let storages = {
		local: ChromeStorage.getLocalStorage('Local'),
		sync: ChromeStorage.getSyncStorage('Sync')
	};

	for (let type in storages) {
		let storage = storages[type];
		testStorage(type, storage);
	}
}

module.exports = runTests;
