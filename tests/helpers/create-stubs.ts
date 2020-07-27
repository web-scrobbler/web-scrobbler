import StorageWrapper from '@/background/storage/storage-wrapper';
import StorageAreaStub from '#/stubs/storage-area-stub';
import ApiCallResult, {
	ApiCallResultType,
} from '@/background/scrobbler/api-call-result';

const storageTestNamespace = 'TestNamespace';

export const scrobblerIdStub = 'stub-id';

export function makeStorageWrapperStub(): StorageWrapper {
	const storageWrapper = new StorageWrapper(
		new StorageAreaStub(),
		storageTestNamespace
	);

	// Patch `debugLog` method to suppress debug output
	storageWrapper.debugLog = () => {
		return Promise.resolve();
	};

	return storageWrapper;
}

export function createApiCallResultStub(
	resultType: ApiCallResultType
): ApiCallResult {
	return new ApiCallResult(resultType, scrobblerIdStub);
}
