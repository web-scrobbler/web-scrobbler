import { ExtensionOptions } from '@/background/repository/extension-options/ExtensionOptions';

import { createOptionsStorage } from '@/background/storage2/StorageFactory';

export function getExtensionOptions(): ExtensionOptions {
	return options;
}

const options = new ExtensionOptions(createOptionsStorage());
