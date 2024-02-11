import type BaseConnector from '@/core/content/connector';
import type { ControllerModeStr } from '@/core/object/controller/controller';
import * as ControllerMode from '@/core/object/controller/controller-mode';
import type Song from '@/core/object/song';
import browser from 'webextension-polyfill';
import * as Options from '@/core/storage/options';
import {
	InfoBoxCSS,
	InfoBoxSelector,
	infoBoxClasses,
	infoBoxIds,
	infoBoxOther,
} from './infobox-selectors';
import { t } from '@/util/i18n';
import { isIos } from '../islatedUtil';

/**
 * Solid is not used here as this is run from content script and the content is
 * injected into page. We do not want to load all of solid for that.
 */

/**
 * Props for button
 * Details all we need to know.
 * isLastItem is needed, as we add bottom border for separation to all other elements.
 * shouldKeepDialogOpen will cause {@link closeDialog} to fail when the button is pressed.
 */
interface infoBoxButtonProps {
	onClick: (ev: MouseEvent) => void;
	label: string;
	connector: BaseConnector;
	isLastItem?: true;
	shouldKeepDialogOpen?: true;
}

/**
 * Props for button as it gets appended.
 * Includes the wrapper element for the append function to know where to append to.
 */
interface infoBoxAppendProps extends infoBoxButtonProps {
	wrapper: HTMLUListElement;
}

/**
 * The current dialog state.
 * We need to keep track of this as we may replace the entire
 * dialog content with an iframe. See {@link editSongButton}
 */
let currentDialog: {
	wrapper: HTMLDivElement;
	buttons: infoBoxButtonProps[];
	connector: BaseConnector;
} | null = null;

/**
 * Opens the infobox dialog.
 *
 * @param e - the mouse event that triggered openDialog
 */
function openDialog(e: MouseEvent) {
	e.stopPropagation();
	const dialog = document.querySelector<HTMLDialogElement>(
		`#${infoBoxIds.dialog}`,
	);
	if (!dialog) {
		return;
	}

	if (dialog.open) {
		dialog.close();
	} else {
		dialog.show();
	}
}

/**
 * Opens the infobox dialog.
 *
 * @param e - the mouse event that triggered openDialog
 */
function closeDialog(e: MouseEvent) {
	if (
		e.target &&
		'closest' in e.target &&
		typeof e.target.closest === 'function' &&
		e.target.closest(`.${infoBoxClasses.buttonPersistDialog}`)
	) {
		return;
	}
	document.querySelector<HTMLDialogElement>(`#${infoBoxIds.dialog}`)?.close();
}

/**
 * Automatically resizes iframe to match size of iframe content.
 * Called by event listener to window message event, which listens
 * for message posted by extension popup iframe.
 *
 * @param e - The message event
 */
function resizeIframe(e: MessageEvent<unknown>) {
	if (
		!e.data ||
		typeof e.data !== 'object' ||
		!('sender' in e.data) ||
		e.data.sender !== 'web-scrobbler-popup' ||
		!('width' in e.data) ||
		!('height' in e.data) ||
		typeof e.data.width !== 'number' ||
		typeof e.data.height !== 'number' ||
		!isFinite(e.data.width) ||
		!isFinite(e.data.height)
	) {
		return;
	}

	const iframe = document.querySelector<HTMLIFrameElement>(
		`#${infoBoxIds.dialog} iframe`,
	);
	if (!iframe) {
		return;
	}

	iframe.width = e.data.width.toString();
	if (isIos()) {
		iframe.height = (window.innerHeight / 2).toString();
	} else {
		iframe.height = e.data.height.toString();
	}
}

/**
 * Applies the appropriate styles from the connector to the element.
 *
 * @param element - Element to apply styles to
 * @param connector - Connector currently being used
 * @param selector - The selector to apply styles for
 */
function applyStyles(
	element: HTMLElement | SVGSVGElement,
	connector: BaseConnector,
	selector: InfoBoxSelector,
) {
	const styles = connector.scrobbleInfoStyle[selector];
	if (styles) {
		for (const prop in styles) {
			element.style[prop] = styles[prop] ?? '';
		}
	}
}

/**
 * Crates an infobox dialog.
 * Mutates {@link currentDialog}.
 *
 * @param props - Properties of the dialog
 */
function createInfoBoxDialog(props: {
	wrapper: HTMLDivElement;
	buttons: infoBoxButtonProps[];
	connector: BaseConnector;
}) {
	currentDialog = props;

	// remove if already exists
	document.querySelector(`#${infoBoxIds.dialog}`)?.remove();

	// create dialog
	const dialog = document.createElement('dialog');
	dialog.id = infoBoxIds.dialog;
	applyStyles(dialog, props.connector, `#${infoBoxIds.dialog}`);
	// reset dialog on close in case user created iframe
	dialog.addEventListener('close', () => {
		if (currentDialog) {
			createInfoBoxDialog(currentDialog);
		}
	});

	// create list
	const list = document.createElement('ul');
	list.id = infoBoxIds.list;
	applyStyles(list, props.connector, `#${infoBoxIds.list}`);
	dialog.appendChild(list);

	// create buttons
	for (const button of props.buttons) {
		appendInfoBoxButton({
			...button,
			wrapper: list,
		});
	}

	// append
	props.wrapper.appendChild(dialog);

	// setup event listeners
	window.removeEventListener('click', closeDialog);
	window.addEventListener('click', closeDialog);
	window.removeEventListener('message', resizeIframe);
	window.addEventListener('message', resizeIframe);
}

/**
 * Appends an infobox button to the dialog list.
 *
 * @param props - {@link infoBoxAppendProps} for the button.
 */
function appendInfoBoxButton(props: infoBoxAppendProps) {
	const item = document.createElement('li');
	item.classList.add(infoBoxClasses.listItem);
	applyStyles(item, props.connector, `.${infoBoxClasses.listItem}`);

	const button = document.createElement('button');
	button.addEventListener('click', (e) => {
		e.stopImmediatePropagation();
		props.onClick(e);
		closeDialog(e);
	});
	button.addEventListener('mouseenter', () => {
		applyStyles(button, props.connector, `$${infoBoxOther.buttonHover}`);
	});
	button.addEventListener('mouseleave', () => {
		button.attributeStyleMap.clear();
		applyStyles(button, props.connector, `.${infoBoxClasses.button}`);
		if (props.shouldKeepDialogOpen) {
			applyStyles(
				button,
				props.connector,
				`.${infoBoxClasses.buttonPersistDialog}`,
			);
		}
		if (!props.isLastItem) {
			applyStyles(
				button,
				props.connector,
				`$${infoBoxOther.buttonSeparator}`,
			);
		}
	});

	button.innerText = props.label;
	button.classList.add(infoBoxClasses.button);
	applyStyles(button, props.connector, `.${infoBoxClasses.button}`);

	if (props.shouldKeepDialogOpen) {
		button.classList.add(infoBoxClasses.buttonPersistDialog);
		applyStyles(
			button,
			props.connector,
			`.${infoBoxClasses.buttonPersistDialog}`,
		);
	}

	if (!props.isLastItem) {
		applyStyles(
			button,
			props.connector,
			`$${infoBoxOther.buttonSeparator}`,
		);
	}

	item.appendChild(button);
	props.wrapper.appendChild(item);
}

/**
 * Fetches the infobox element, or creates it if it doesn't exist.
 *
 * @param connector - the current connector
 */
async function getInfoBoxElementUnsafe(
	connector: BaseConnector,
): Promise<HTMLDivElement | null> {
	if (
		!connector.scrobbleInfoLocationSelector ||
		// infobox is disabled in options
		!(await Options.getOption(Options.USE_INFOBOX, connector.meta.id))
	) {
		return null;
	}

	const parentEl = Util.queryElements(
		connector.scrobbleInfoLocationSelector,
	)?.[0];
	if (!parentEl) {
		return null;
	}

	// check if infobox element was already created
	let infoBoxElement = document.querySelector<HTMLDivElement>(
		`#${infoBoxIds.wrapper}`,
	);

	// check if element is still in the correct place
	if (infoBoxElement) {
		if (infoBoxElement.parentElement !== parentEl) {
			infoBoxElement.remove();
		} else {
			return infoBoxElement;
		}
	}

	// if it was not in the correct place or didn't exist, create it
	infoBoxElement = document.createElement('div');
	infoBoxElement.id = infoBoxIds.wrapper;

	// style the infobox
	applyStyles(infoBoxElement, connector, `#${infoBoxIds.wrapper}`);

	parentEl.appendChild(infoBoxElement);
	return infoBoxElement;
}

/**
 * Fetches the infobox element, or creates it if it doesn't exist.
 * Has some additional cleanup logic to be safer.
 *
 * @param connector - Current connector.
 * @returns The infobox element.
 */
async function getInfoBoxElementSafe(
	connector: BaseConnector,
): Promise<HTMLDivElement | null> {
	const infoBoxElement = await getInfoBoxElementUnsafe(connector);
	if (!infoBoxElement) {
		// clean up
		const infoBoxElement = document.querySelector<HTMLButtonElement>(
			`#${infoBoxIds.wrapper}`,
		);
		if (infoBoxElement) {
			infoBoxElement.remove();
		}
		return null;
	}
	return infoBoxElement;
}

/**
 * Updates the infobox details
 *
 * @param props - Props for the infobox
 * @returns
 */
export async function updateInfoBox(props: {
	mode: ControllerModeStr;
	permanentMode: ControllerModeStr;
	song: Song | null;
	connector: BaseConnector;
}) {
	let oldInfoBoxText: string | false = false;
	const infoBoxElement = await getInfoBoxElementSafe(props.connector);
	if (!infoBoxElement) {
		return;
	}

	const textEl = infoBoxElement.querySelector<HTMLButtonElement>(
		`#${infoBoxIds.title}`,
	);
	if (textEl) {
		oldInfoBoxText = textEl.innerText;
	}

	const infoBoxText = Util.getInfoBoxText(props.mode, props.song);

	// Check if infobox needs to be updated
	if (!oldInfoBoxText || infoBoxText !== oldInfoBoxText) {
		// create expand button
		const infoBoxExpandButton = document.createElement('button');
		infoBoxExpandButton.id = infoBoxIds.expandButton;
		infoBoxExpandButton.title = t('optionUseInfobox');
		applyStyles(
			infoBoxExpandButton,
			props.connector,
			`#${infoBoxIds.expandButton}`,
		);
		infoBoxExpandButton.addEventListener('click', openDialog);

		// create label and image
		const img = document.createElement('img');
		img.src = browser.runtime.getURL('./icons/icon_main_48.png');
		img.alt = 'Web Scrobbler state:';
		applyStyles(img, props.connector, `#${infoBoxIds.icon}`);

		const info = document.createElement('span');
		info.id = infoBoxIds.title;
		info.innerText = infoBoxText;
		applyStyles(info, props.connector, `#${infoBoxIds.title}`);

		const expandIcon = createMoreVertIcon(props.connector);

		infoBoxExpandButton.appendChild(img);
		infoBoxExpandButton.appendChild(info);
		infoBoxExpandButton.appendChild(expandIcon);

		// Clear old contents of infoBoxElement
		while (infoBoxElement.lastChild) {
			infoBoxElement.removeChild(infoBoxElement.lastChild);
		}

		infoBoxElement.appendChild(infoBoxExpandButton);

		const buttons: infoBoxButtonProps[] = [];

		// we want to ignore pause or loved state here and display or not display regardless.
		// hence we use the direct private mode, and not the getMode() result.
		if (props.permanentMode === ControllerMode.Playing) {
			buttons.push(
				editSongButton(props.connector),
				skipSongButton(props.connector),
			);
		}
		if (props.mode === ControllerMode.Disallowed) {
			buttons.push(forceScrobbleButton(props.connector));
		}

		if (props.mode === ControllerMode.Disabled) {
			buttons.push(enableConnectorButton(props.connector));
		} else {
			buttons.push(disableConnectorButton(props.connector));
		}

		buttons.push(disableInfoBoxButton(props.connector));

		createInfoBoxDialog({
			wrapper: infoBoxElement,
			buttons,
			connector: props.connector,
		});
	}
}

/**
 * Prepare a button for disabling infobox for a website.
 *
 * @param connector - current connector
 * @returns {@link infoBoxButtonProps} for a disable infobox button.
 */
const disableInfoBoxButton = (
	connector: BaseConnector,
): infoBoxButtonProps => ({
	onClick: () => {
		const infoBoxElement = document.querySelector<HTMLDivElement>(
			`#${infoBoxIds.wrapper}`,
		);
		infoBoxElement?.remove();
		Options.setConnectorOverrideOption(
			connector.meta.id,
			Options.USE_INFOBOX,
			false,
		);
	},
	label: t('infoBoxDisable', connector.meta.label),
	connector,
	isLastItem: true,
});

/**
 * Prepare a button for enabling connector for a website.
 *
 * @param connector - current connector
 * @returns {@link infoBoxButtonProps} for a enable connector button.
 */
const enableConnectorButton = (
	connector: BaseConnector,
): infoBoxButtonProps => ({
	onClick: () => {
		connector.controller?.setConnectorState(true);
	},
	label: t('menuEnableConnector', connector.meta.label),
	connector,
});

/**
 * Prepare a button for disabling connector for a website.
 *
 * @param connector - current connector
 * @returns {@link infoBoxButtonProps} for a disable connector button.
 */
const disableConnectorButton = (
	connector: BaseConnector,
): infoBoxButtonProps => ({
	onClick: () => {
		connector.controller?.setConnectorState(false);
	},
	label: t('menuDisableConnector', connector.meta.label),
	connector,
});

/**
 * Prepare a button for forcing scrobbling current song
 *
 * @param connector - current connector
 * @returns {@link infoBoxButtonProps} for a force scrobble button.
 */
const forceScrobbleButton = (connector: BaseConnector): infoBoxButtonProps => ({
	onClick: () => {
		connector.controller?.forceScrobbleSong();
	},
	label: t('disallowedButton'),
	connector,
});

/**
 * Prepare a button for skipping current song.
 *
 * @param connector - current connector
 * @returns {@link infoBoxButtonProps} for a skip song button.
 */
const skipSongButton = (connector: BaseConnector): infoBoxButtonProps => ({
	onClick: () => {
		connector.controller?.skipCurrentSong();
	},
	label: t('infoSkipTitle'),
	connector,
});

const editSongButton = (connector: BaseConnector): infoBoxButtonProps => ({
	onClick: (e) => {
		e.stopImmediatePropagation();
		const infoBoxDialog = document.querySelector<HTMLDialogElement>(
			`#${infoBoxIds.dialog}`,
		);
		if (!infoBoxDialog) {
			return;
		}

		// Clear old contents of infoBoxDialog
		while (infoBoxDialog.lastChild) {
			infoBoxDialog.removeChild(infoBoxDialog.lastChild);
		}

		const frame = document.createElement('iframe');
		frame.src = browser.runtime.getURL(
			'src/ui/popup/index.html?action=edit',
		);
		frame.style.display = 'block';
		infoBoxDialog.appendChild(frame);
	},
	label: t('infoEditTitle'),
	connector,
	shouldKeepDialogOpen: true,
});

function createMoreVertIcon(connector: BaseConnector): SVGSVGElement {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('focusable', 'false');
	svg.setAttribute('aria-hidden', 'true');
	svg.setAttribute('viewBox', '8 0 24 24');
	svg.setAttribute('height', '24');
	svg.id = infoBoxIds.detailsIcon;
	applyStyles(svg, connector, '#scrobbler-infobox-details-icon');

	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute(
		'd',
		'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2',
	);

	svg.appendChild(path);

	return svg;
}

/**
 * Default styling of scrobble info elements.
 */
export const DEFAULT_SCROBBLE_INFO_STYLE: InfoBoxCSS = {
	'#scrobbler-infobox-wrapper': {
		position: 'relative',
	},
	'#scrobbler-infobox-expand-button': {
		display: 'flex',
		gap: '0.5em',
		alignItems: 'center',
		appearance: 'none',
		background: 'transparent',
		border: 'none',
		cursor: 'pointer',
		padding: '0',
	},
	'#scrobbler-infobox-icon': {
		height: '1.2em',
	},
	'#scrobbler-infobox-details-icon': {
		height: '1.2em',
		width: '1.2em',
	},
	'#scrobbler-infobox-list': {
		listStyleType: 'none',
		margin: '0',
		padding: '0',
	},
	'#scrobbler-infobox-dialog': {
		padding: '0',
		borderRadius: '0.5em',
		background: 'transparent',
		position: 'absolute',
		zIndex: '10000000',
		left: '0',
		bottom: '0',
		margin: '0',
		transform: 'translateY(100%)',
	},
	'.scrobbler-infobox-list-item': {
		backgroundColor: '#d82323',
	},
	'.scrobbler-infobox-button': {
		appearance: 'none',
		background: 'transparent',
		border: 'none',
		cursor: 'pointer',
		padding: '0.75em',
		color: 'white',
		fontSize: '1.4em',
		width: '100%',
		textAlign: 'left',
	},
	'$button-separator': {
		borderBottom: '1px solid white',
	},
	'$button-hover': {
		backgroundColor: '#fc3434',
	},
};
