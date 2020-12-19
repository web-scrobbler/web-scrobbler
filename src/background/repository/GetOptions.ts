import { Options } from './options/Options';
import { ExtensionOptions } from './options/ExtensionOptions';
import { ExtensionOptionsRepositoryData } from './options/ExtensionOptionsRepositoryData';

import { createOptionsStorage } from '@/background/storage2/StorageFactory';

export function getOptions(): Options {
	return options;
}

function createOptions(): Options {
	const optionsStorage = createOptionsStorage<
		ExtensionOptionsRepositoryData
	>();
	return new ExtensionOptions(optionsStorage);
}

const options = createOptions();
