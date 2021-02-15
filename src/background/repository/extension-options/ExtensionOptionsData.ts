import { ExtensionOptionsRepositoryData } from './ExtensionOptionsRepositoryData';

export type ExtensionOptionKey = keyof ExtensionOptionsData;

export type ExtensionOptionsData = Omit<
	ExtensionOptionsRepositoryData,
	'disabledConnectors'
>;
