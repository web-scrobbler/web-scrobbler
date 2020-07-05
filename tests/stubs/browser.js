import StorageAreaStub from './storage-area';

export default {
	storage: {
		local: new StorageAreaStub(),
		sync: new StorageAreaStub(),
	},
};
