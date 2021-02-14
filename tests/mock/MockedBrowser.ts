import { MemoryStorageArea } from '#/stub/MemoryStorageArea';
import { i18nStub } from '#/stub/I18nStub';

export const mockedBrowser = {
	storage: {
		local: new MemoryStorageArea(),
		sync: new MemoryStorageArea(),
	},
	i18n: i18nStub,
};
