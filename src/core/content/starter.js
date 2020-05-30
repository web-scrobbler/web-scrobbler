'use strict';

/**
 * This script is injected to the page after the {@link BaseConnector} and
 * a custom connector are already in place and set up.
 *
 * As custom connectors should be declarative only without any actions triggered
 * on pageload, this starter is needed for connectors to start running
 */
(() => {
	if (window.STARTER_LOADED !== undefined) {
		Util.debugLog('Starter is already loaded', 'warn');
		return;
	}
	window.STARTER_LOADED = true;

	if (isConnectorInvalid()) {
		Util.debugLog('You have overwritten or unset the Connector object', 'warn');
		return;
	}

	setupStateListening();

	/* Internal functions. */

	function isConnectorInvalid() {
		return typeof Connector === 'undefined' || !(Connector instanceof BaseConnector);
	}

	function setupStateListening() {
		new Reactor(Connector);

		if (Connector.playerSelector === null) {
			Util.debugLog('`Connector.playerSelector` is empty. The current connector is expected to manually detect state changes', 'info');
			return;
		}

		Util.debugLog('Setting up observer');

		const observeTarget = document.querySelector(Connector.playerSelector);
		if (observeTarget !== null) {
			setupObserver(observeTarget);
		} else {
			Util.debugLog(`Element '${Connector.playerSelector}' is missing`, 'warn');
			setupSecondObserver();
		}
	}

	function setupObserver(observeTarget) {
		const observer = new MutationObserver(Connector.onStateChanged);
		const observerConfig = {
			childList: true, subtree: true,
			attributes: true, characterData: true,
		};

		observer.observe(observeTarget, observerConfig);

		Util.debugLog(`Used '${Connector.playerSelector}' to watch changes.`);
	}

	function setupSecondObserver() {
		const playerObserver = new MutationObserver(() => {
			const observeTarget = document.querySelector(Connector.playerSelector);
			if (observeTarget !== null) {
				playerObserver.disconnect();
				setupObserver(observeTarget);
			}
		});

		const playerObserverConfig = {
			childList: true, subtree: true,
			attributes: false, characterData: false,
		};
		playerObserver.observe(document, playerObserverConfig);
	}
})();
