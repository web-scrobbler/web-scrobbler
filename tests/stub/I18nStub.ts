export const i18nStub = {
	getMessage(stringId: string): string {
		return translationStrings[stringId] || '';
	},
};

const translationStrings: Record<string, string> = {
	availableStringId: 'Translated string',
};
