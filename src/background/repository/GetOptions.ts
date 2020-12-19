import { Options } from '@/background/repository/options/Options';
import { ExtensionOptions } from '@/background/repository/options/ExtensionOptions';
import { ExtensionOptionsData } from '@/background/repository/options/ExtensionOptionsData';

import { createOptionsStorage } from '@/background/storage2/StorageFactory';

export function getOptions(): Options<ExtensionOptionsData> {
	return options;
}

const options = new ExtensionOptions(createOptionsStorage());
