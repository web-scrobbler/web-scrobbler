import { MockedStorageArea } from '#/mock/MockedStorageArea';
import { mockedI18n } from '#/mock/MockedI18n';

export const mockedBrowser = {
	storage: {
		local: new MockedStorageArea(),
		sync: new MockedStorageArea(),
	},
	i18n: mockedI18n,
};
