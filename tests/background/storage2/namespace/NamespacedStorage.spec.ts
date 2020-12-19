import { expect } from 'chai';

import { getTestName } from '#/helpers/util';
import { MockedStorageArea } from '#/mock/MockedStorageArea';

import { Storage } from '@/background/storage2/Storage';
import { NamespaceStorage } from '@/background/storage2/namespace/NamespaceStorage';

describe(getTestName(__filename), () => {
	describe('test creation', testStorageCreation);
	describe('test work', testNamespaceStorage);
});

function testNamespaceStorage() {
	const storage = createNamespaceStorage('TestNamespace');

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

	it('should update storage', async () => {
		const newData = { test: 'ok', key: 'value' };
		const dataToAdd = { key: 'value' };
		await storage.update(dataToAdd);

		const data = await storage.get();
		expect(newData).to.be.deep.equal(data);
	});

	it('should clear storage', async () => {
		await storage.clear();

		const data = await storage.get();
		expect({}).to.be.deep.equal(data);
	});
}

function testStorageCreation() {
	it('should create storage with proper namespace', () => {
		expect(createNamespaceStorage('Test')).to.be.instanceOf(
			NamespaceStorage
		);
	});

	it('should not create storage with empty namespace', () => {
		expect(() => {
			createNamespaceStorage('');
		}).to.throw();
	});

	it('should not create storage with null namespace', () => {
		expect(() => {
			createNamespaceStorage(null);
		}).to.throw();
	});

	it('should not create storage with undefined namespace', () => {
		expect(() => {
			createNamespaceStorage(undefined);
		}).to.throw();
	});
}

function createNamespaceStorage(namespage: string): Storage<unknown> {
	return new NamespaceStorage(new MockedStorageArea(), namespage);
}
