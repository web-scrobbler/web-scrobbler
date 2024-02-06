export const infoBoxIds = {
	wrapper: 'scrobbler-infobox-wrapper',
	expandButton: 'scrobbler-infobox-expand-button',
	dialog: 'scrobbler-infobox-dialog',
	list: 'scrobbler-infobox-list',
	title: 'scrobbler-infobox-title',
	icon: 'scrobbler-infobox-icon',
} as const;

type InfoBoxIdSelector = `#${(typeof infoBoxIds)[keyof typeof infoBoxIds]}`;

export const infoBoxClasses = {
	listItem: 'scrobbler-infobox-list-item',
	button: 'scrobbler-infobox-button',
	buttonPersistDialog: 'scrobbler-infobox-persist-dialog',
} as const;

type InfoBoxClassSelector =
	`.${(typeof infoBoxClasses)[keyof typeof infoBoxClasses]}`;

export const infoBoxOther = {
	buttonHover: 'button-hover',
	buttonSeparator: 'button-separator',
};

export type InfoBoxOther =
	`$${(typeof infoBoxOther)[keyof typeof infoBoxOther]}`;

export type InfoBoxSelector =
	| InfoBoxIdSelector
	| InfoBoxClassSelector
	| InfoBoxOther;

export type InfoBoxCSS = Partial<
	Record<InfoBoxSelector, Partial<CSSStyleDeclaration>>
>;

// this is so small that it is probably faster to just use an array anyway
const infoBoxSelectors = [
	...Object.values(infoBoxIds).map((id) => `#${id}`),
	...Object.values(infoBoxClasses).map((className) => `.${className}`),
	...Object.values(infoBoxOther).map((otherName) => `$${otherName}`),
];

/**
 * Checks if a given string is a valid {@link InfoBoxSelector}
 *
 * @param selector - string to check if is valid {@link InfoBoxSelector}
 * @returns true if string is valid {@link InfoBoxSelector}; false otherwise
 */
export function isValidInfoBoxSelector(
	selector: string,
): selector is InfoBoxSelector {
	return infoBoxSelectors.includes(selector);
}
