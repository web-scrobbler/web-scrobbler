export const mockedI18n = {
	getMessage(stringId: string): string {
		return translationStrings[stringId] || '';
	},
};

const translationStrings: Record<string, string> = {
	availableStringId: 'Translated string',
};
