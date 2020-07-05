import { expect } from 'chai';

import BrowserStorage from '@/background/storage/browser-storage';

/**
 * Test storage object.
 *
 * @param {String} type Storage type
 * @param {Object} storage Storage instance
 */
function testStorage(type, storage) {
	describe(`${type} storage`, () => {
		it('should return empty object', async () => {
			const data = await storage.get();
			expect({}).to.be.deep.equal(data);
		});

		it('should set key value', async () => {
			const newData = { test: 'ok' };
			await storage.set(newData);

			const data = await storage.get();
			expect(newData).to.be.deep.equal(data);
		});

		it('should update storage', () => {
			const newData = { test: 'ok', key: 'value' };
			const dataToAdd = { key: 'value' };
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
	const storages = {
		local: BrowserStorage.getLocalStorage('Local'),
		sync: BrowserStorage.getSyncStorage('Sync'),
	};

	for (const type in storages) {
		const storage = storages[type];
		testStorage(type, storage);
	}

	testBrowserStorage();
}

function testBrowserStorage() {
	it('should return local storage', () => {
		const storage = BrowserStorage.getScrobblerStorage('LastFM');
		expect(storage).to.be.an('object');
	});

	it('should return local storage', () => {
		const storage = BrowserStorage.getStorage(BrowserStorage.CORE);
		expect(storage).to.be.an('object');
	});

	it('should return sync storage', () => {
		const storage = BrowserStorage.getStorage(BrowserStorage.OPTIONS);
		expect(storage).to.be.an('object');
	});

	it('should throw error for unknown storage', () => {
		expect(() => {
			return BrowserStorage.getStorage('unknown-storage123');
		}).to.throw();
	});
}

runTests();
