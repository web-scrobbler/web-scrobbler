'use strict';

/**
 * Tests for 'BrowserStorage' module.
 */

const expect = require('chai').expect;
const BrowserStorage = require('../../src/core/background/storage/browser-storage');

/**
 * Test storage object.
 * @param  {String} type Storage type
 * @param  {Object} storage Storage instance
 */
function testStorage(type, storage) {
	describe(`${type} storage`, () => {
		it('should return empty object', async() => {
			const data = await storage.get();
			expect({}).to.be.deep.equal(data);
		});

		it('should set key value', async() => {
			const newData = { test: 'ok' };
			await storage.set(newData);

			const data = await storage.get();
			expect(newData).to.be.deep.equal(data);
		});

		it('should update storage', () => {
			let newData = { test: 'ok', key: 'value' };
			let dataToAdd = { key: 'value' };
			return storage.update(dataToAdd).then(() => {
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
		local: BrowserStorage.getLocalStorage('Local'),
		sync: BrowserStorage.getSyncStorage('Sync')
	};

	for (let type in storages) {
		let storage = storages[type];
		testStorage(type, storage);
	}
}

runTests();
