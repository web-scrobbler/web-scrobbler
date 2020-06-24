'use strict';

const StorageWrapper = require('../src/core/background/storage/wrapper');
const StorageAreaStub = require('./stubs/storage-area');

const storageTestNamespace = 'TestNamespace';

function makeStorageWrapperStub() {
	const storageWrapper = new StorageWrapper(
		new StorageAreaStub(),
		storageTestNamespace
	);
	storageWrapper.debugLog = () => {
		// Do nothing
	};

	return storageWrapper;
}

module.exports = { makeStorageWrapperStub };
