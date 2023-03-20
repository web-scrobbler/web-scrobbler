/*
 * As custom connectors should be declarative only without any actions triggered
 * on pageload, this starter is needed for connectors to start running
 */

import Reactor from '@/core/content/reactor';
import BaseConnector from './connector';
import * as BrowserStorage from '@/core/storage/browser-storage';
import { DISABLED_CONNECTORS } from '@/core/storage/options';
import { sendContentMessage } from '@/util/communication';

export default function start() {
	if (window.STARTER_LOADED) {
		Util.debugLog('Starter is already loaded', 'warn');
		return;
	}

	if (isConnectorInvalid()) {
		Util.debugLog(
			'You have overwritten or unset the Connector object',
			'warn'
		);
		return;
	}

	void setupStateListening();
}

function isConnectorInvalid() {
	return (
		typeof Connector === 'undefined' ||
		!(Connector instanceof BaseConnector)
	);
}

async function setupStateListening() {
	const globalOptions = BrowserStorage.getStorage(BrowserStorage.OPTIONS);
	const options = await globalOptions.get();
	const disabledTabs = BrowserStorage.getStorage(
		BrowserStorage.DISABLED_TABS
	);
	const disabledTabList = await disabledTabs.get();
	const currentTab = await sendContentMessage({
		type: 'getTabId',
		payload: undefined,
	});
	new Reactor(
		Connector,
		!disabledTabList?.[currentTab ?? -2]?.[Connector.meta.id] &&
			(options === null ||
				!options[DISABLED_CONNECTORS][Connector.meta.id])
	);

	if (Connector.playerSelector === null) {
		Util.debugLog(
			'`Connector.playerSelector` is empty. The current connector is expected to manually detect state changes',
			'info'
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
			'warn'
		);
		setupSecondObserver();
	}
}

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
		}' to watch changes.`
	);
}

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

function retrieveObserveTarget() {
	return document.querySelector(Connector.playerSelector?.toString() ?? '');
}
