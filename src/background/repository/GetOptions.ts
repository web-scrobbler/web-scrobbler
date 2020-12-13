import { Options } from './options/Options';
import { ExtensionOptions } from './options/ExtensionOptions';
import { OptionsRepositoryData } from './options/ExtensionOptionsRepositoryData';

import { createOptionsStorage } from '@/background/storage2/CreateStorage';

export function getOptions(): Options {
	return options;
}

function createOptions(): Options {
	const optionsStorage = createOptionsStorage<OptionsRepositoryData>();
	return new ExtensionOptions(optionsStorage);
}

const options = createOptions();
