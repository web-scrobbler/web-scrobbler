import StorageWrapper from '../src/background/storage/storage-wrapper';
import StorageAreaStub from './stubs/storage-area';

const storageTestNamespace = 'TestNamespace';

export function makeStorageWrapperStub() {
	const storageWrapper = new StorageWrapper(
		new StorageAreaStub(),
		storageTestNamespace
	);
	storageWrapper.debugLog = () => {
		// Do nothing
	};

	return storageWrapper;
}
