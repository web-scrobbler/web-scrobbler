/*
 * As custom connectors should be declarative only without any actions triggered
 * on pageload, this starter is needed for connectors to start running
 */

import BaseConnector from './connector';
import * as BrowserStorage from '@/core/storage/browser-storage';
import { DISABLED_CONNECTORS } from '@/core/storage/options';
import { sendContentMessage } from '@/util/communication';
import * as Util from '@/core/content/util';
import Controller from '../object/controller/controller';

/**
 * Sets up observers and "starts up" the connector
 */
export default function start(): void {
	if (window.STARTER_LOADED) {
		Util.debugLog('Starter is already loaded', 'warn');
		return;
	}

	if (isConnectorInvalid()) {
		Util.debugLog(
			'You have overwritten or unset the Connector object',
			'warn',
		);
		return;
	}

	void setupStateListening();
}

/**
 * Checks if there is a valid connector loaded in the tab.
 *
 * @returns true if no valid connector is loaded, false if there is a valid connector loaded.
 */
function isConnectorInvalid(): boolean {
	return (
		typeof Connector === 'undefined' ||
		!(Connector instanceof BaseConnector)
	);
}

/**
 * Sets up state listening and controller.
 */
async function setupStateListening(): Promise<void> {
	const globalOptions = BrowserStorage.getStorage(BrowserStorage.OPTIONS);
	const options = await globalOptions.get();
	const disabledTabs = BrowserStorage.getStorage(
		BrowserStorage.DISABLED_TABS,
	);
	const disabledTabList = await disabledTabs.get();
	const currentTab = await sendContentMessage({
		type: 'getTabId',
		payload: undefined,
	});

	createController(
		!disabledTabList?.[currentTab ?? -2]?.[Connector.meta.id] &&
			(options === null ||
				!options[DISABLED_CONNECTORS][Connector.meta.id]),
	);

	if (Connector.playerSelector === null) {
		Util.debugLog(
			'`Connector.playerSelector` is empty. The current connector is expected to manually detect state changes',
			'info',
		);
		return;
	}

	Util.debugLog('Setting up observer');

	const observeTarget = retrieveObserveTarget();
	if (observeTarget !== null) {
		setupObserver(observeTarget);
	} else {
		Util.debugLog(
			`Element '${Connector.playerSelector.toString()}' is missing`,
			'warn',
		);
		setupSecondObserver();
	}
}

/**
 * Creates controller
 *
 * @param isEnabled - Whether the connector is enabled or not
 */
function createController(isEnabled: boolean) {
	const controller = new Controller(Connector, isEnabled);
	Connector.controllerCallback = controller.onStateChanged.bind(controller);
}

/**
 * Setup state change observer for a connector.
 *
 * @param observeTarget - The node to observe for state changes
 */
function setupObserver(observeTarget: Node) {
	const observer = new MutationObserver(Connector.onStateChanged);
	const observerConfig = {
		childList: true,
		subtree: true,
		attributes: true,
		characterData: true,
	};

	observer.observe(observeTarget, observerConfig);

	Util.debugLog(
		`Used '${
			Connector.playerSelector?.toString() ??
			'errorPlayerSelectorNotDefined'
		}' to watch changes.`,
	);
}

/**
 * Set up backup observer to be used if the main observer target doesn't exist
 */
function setupSecondObserver() {
	const playerObserver = new MutationObserver(() => {
		const observeTarget = retrieveObserveTarget();
		if (observeTarget !== null) {
			playerObserver.disconnect();
			setupObserver(observeTarget);
		}
	});

	const playerObserverConfig = {
		childList: true,
		subtree: true,
		attributes: false,
		characterData: false,
	};
	playerObserver.observe(document, playerObserverConfig);
}

/**
 * Fetches the element the connector wants to observe.
 *
 * @returns the element to be observed
 */
function retrieveObserveTarget(): Element | null {
	if (Connector.playerSelector === null) {
		return null;
	}

	if (typeof Connector.playerSelector === 'object') {
		for (const selector of Connector.playerSelector) {
			const element = document.querySelector(selector);
			if (element !== null) {
				return element;
			}
		}
		return null;
	}

	return document.querySelector(Connector.playerSelector);
}
