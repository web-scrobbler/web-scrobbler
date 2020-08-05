import { StorageAreaStub } from '#/stubs/storage-area-stub';

const translationStrings: Record<string, string> = {
	availableStringId: 'Translated string',
};

export const browserStub = {
	storage: {
		local: new StorageAreaStub(),
		sync: new StorageAreaStub(),
	},
	i18n: {
		getMessage(stringId: string): string {
			return translationStrings[stringId] || '';
		},
	},
};
