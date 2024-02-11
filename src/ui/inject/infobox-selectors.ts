/**
 * Contains typing information for infobox elements.
 * To help visualize, this is roughly what it looks like.
 *
 * \<div id=infoBoxIds.wrapper\>
 *   \<button id=infoBoxIds.expandButton\>
 *     \<img id=infoBoxIds.icon src=icon /\>
 *     \<span id=infoBoxIds.info\>information\</span\>
 *   \</button\>
 *   \<dialog id=infoBoxIds.dialog\>
 *     \<ul id=infoBoxIds.list\>
 *       \<li class=infoBoxClasses.listItem\>
 *         \<button class=infoBoxClasses.button\>Button label\</button\>
 *       \</li\>
 *       ...
 *     \</ul\>
 *   \</dialog\>
 * \</div\>
 */

/**
 * Element IDs found within scrobbling infobox.
 */
export const infoBoxIds = {
	/**
	 * \<div\> element wrapping everything.
	 *
	 * Contains exactly one {@link infoBoxIds.expandButton} and one {@link infoBoxIds.dialog}.
	 *
	 * Embedded directly into webpage.
	 */
	wrapper: 'scrobbler-infobox-wrapper',

	/**
	 * The button that toggles display of {@link infoBoxIds.dialog}.
	 *
	 * Contains {@link infoBoxIds.title}, {@link infoBoxIds.icon}, and {@link infoBoxIds.detailsIcon}.
	 *
	 * Contained within {@link infoBoxIds.wrapper}.
	 */
	expandButton: 'scrobbler-infobox-expand-button',

	/**
	 * The dialog element.
	 * {@link infoBoxIds.expandButton} opens and closes this.
	 *
	 * Additionally, pressing buttons that are not {@link infoBoxClasses.buttonPersistDialog} will close it, and clicking outside the dialog will close it.
	 *
	 * Either contains only a single {@link infoBoxIds.list} element, or contains some other element created by a button.
	 *
	 * At time of writing, the list may be replaced with a extension popup iframe, but this may be out of date.
	 *
	 * Contained within {@link infoBoxIds.wrapper}.
	 */
	dialog: 'scrobbler-infobox-dialog',

	/**
	 * The \<ul\> element wrapping all {@link infoBoxClasses.listItem} elements.
	 *
	 * When this element exists, it is within {@link infoBoxIds.dialog} which contains only this element.
	 */
	list: 'scrobbler-infobox-list',

	/**
	 * The <span> element containing the current state text.
	 *
	 * Contained within {@link infoBoxIds.expandButton}
	 */
	title: 'scrobbler-infobox-title',

	/**
	 * The web scrobbler icon.
	 *
	 * Contained within {@link infoBoxIds.expandButton}
	 */
	icon: 'scrobbler-infobox-icon',

	/**
	 * The see more details icon.
	 *
	 * Contained within {@link infoBoxIds.expandButton}
	 */
	detailsIcon: 'scrobbler-infobox-details-icon',
} as const;

/**
 * Element IDs found within scrobbling infobox.
 */
type InfoBoxIdSelector = `#${(typeof infoBoxIds)[keyof typeof infoBoxIds]}`;

/**
 * Element classes found within scrobbling infobox.
 */
export const infoBoxClasses = {
	/**
	 * A \<li\> element within {@link infoBoxIds.list}
	 *
	 * Contains exactly one {@link infoBoxClasses.button}
	 */
	listItem: 'scrobbler-infobox-list-item',

	/**
	 * An interactable button that has some function.
	 *
	 * Each {@link infoBoxClasses.listItem} contains exactly one of these buttons.
	 */
	button: 'scrobbler-infobox-button',

	/**
	 * An interactable button that should not close the dialog when clicked.
	 *
	 * These buttons also have the {@link infoBoxClasses.button} class.
	 */
	buttonPersistDialog: 'scrobbler-infobox-persist-dialog',
} as const;

/**
 * Element classes found within scrobbling infobox.
 */
type InfoBoxClassSelector =
	`.${(typeof infoBoxClasses)[keyof typeof infoBoxClasses]}`;

/**
 * Other selectors for special behaviors within infobox.
 */
export const infoBoxOther = {
	/**
	 * Selector for a button currently being hovered.
	 *
	 * Properties will override any properties in {@link infoBoxClasses.button}
	 */
	buttonHover: 'button-hover',

	/**
	 * Selector for a button that is not the last button.
	 * Intended to allow a border-bottom separating the buttons.
	 *
	 * Properties will override any properties in {@link infoBoxClasses.button}
	 */
	buttonSeparator: 'button-separator',
};

/**
 * Other selectors for special behaviors within infobox.
 */
export type InfoBoxOther =
	`$${(typeof infoBoxOther)[keyof typeof infoBoxOther]}`;

/**
 * Union type for all types of selectors used by infobox.
 */
export type InfoBoxSelector =
	| InfoBoxIdSelector
	| InfoBoxClassSelector
	| InfoBoxOther;

/**
 * An object containing partial style info for infobox.
 */
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
