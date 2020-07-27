import { expect } from 'chai';

import { getTestName } from '#/helpers/util';
import { makeStorageWrapperStub } from '#/helpers/create-stubs';

describe(getTestName(__filename), () => {
	const storage = makeStorageWrapperStub();

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
});
