/* eslint-disable @typescript-eslint/no-unused-expressions */

/**
 * Tests for 'BrowserStorage' module.
 */

import '#/mocks/webextension-polyfill';
import * as BrowserStorage from '@/core/storage/browser-storage';
import type StorageWrapper from '@/core/storage/wrapper';
import { describe, it, expect } from 'vitest';

/**
 * Test storage object.
 * @param type - Storage type
 * @param storage - Storage instance
 */
function testStorage<K extends BrowserStorage.StorageNamespace>(
	type: K,
	storage: StorageWrapper<K>,
) {
	describe(`${type} storage`, () => {
		it('should return empty object', async () => {
			const data = await storage.get();
			expect(data).to.be.null;
		});

		it('should set key value', async () => {
			const newData = { test: 'ok' };
			// @ts-expect-error lazy about constructing a valid data model
			await storage.set(newData);

			const data = await storage.get();
			expect(newData).to.be.deep.equal(data);
		});

		it('should update storage', async () => {
			const newData = { test: 'ok', key: 'value' };
			const dataToAdd = { key: 'value' };
			// @ts-expect-error lazy about constructing a valid data model
			await storage.update(dataToAdd);
			const data = await storage.get();
			expect(newData).to.deep.equal(data);
		});

		it('should clear storage', async () => {
			await storage.clear();
			const data = await storage.get();
			expect(data).to.be.null;
		});
	});
}

/**
 * Run all tests.
 */
function runTests() {
	const storages = {
		// @ts-expect-error not a storage type we ever expect
		local: BrowserStorage.getLocalStorage('Local'),
		// @ts-expect-error not a storage type we ever expect
		sync: BrowserStorage.getSyncStorage('Sync'),
	};

	for (const type in storages) {
		// @ts-expect-error iterate over everything without checking for hygiene

		const storage = storages[type];
		// @ts-expect-error see above

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
			// @ts-expect-error actually fails typechecking on top of it
			return BrowserStorage.getStorage('unknown-storage123');
		}).to.throw();
	});
}

runTests();
