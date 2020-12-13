import { MockedStorageArea } from '#/mock/MockedStorageArea';

const translationStrings: Record<string, string> = {
	availableStringId: 'Translated string',
};

export const browserStub = {
	storage: {
		local: new MockedStorageArea(),
		sync: new MockedStorageArea(),
	},
	i18n: {
		getMessage(stringId: string): string {
			return translationStrings[stringId] || '';
		},
	},
};
