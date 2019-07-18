'use strict';

/**
 * This script is injected to the page after the {@link BaseConnector} and
 * a custom connector are already in place and set up.
 *
 * As custom connectors should be declarative only without any actions triggered
 * on pageload, this starter is needed for connectors to start running
 */
(() => {
	// Intentionally global lock to avoid multiple execution of this function.
	if (window.STARTER_LOADED !== undefined) {
		Util.debugLog('Starter is already loaded', 'warn');
		return;
	}
	window.STARTER_LOADED = true;

	if (isConnectorInvalid()) {
		// Warnings to help developers with their custom connectors
		Util.debugLog(
			'You have overwritten or unset the Connector object', 'warn');
		return;
	}

	setupStateListening();

	/* Internal functions. */

	function isConnectorInvalid() {
		return typeof(Connector) === 'undefined' || !(Connector instanceof BaseConnector);
	}

	function setupStateListening() {
		// Observe state and communicates with background script.
		new Reactor(Connector);

		// Set up Mutation observing as a default state change detection
		if (Connector.playerSelector === null) {
			/**
			 * Player selector is not provided, current connector needs
			 * to detect state changes on its own.
			 */
			Util.debugLog(
				'Connector.playerSelector is empty. The current connector is expected to manually detect state changes', 'info');
			return;
		}

		Util.debugLog('Setting up observer');

		let observeTarget = document.querySelector(Connector.playerSelector);
		if (observeTarget !== null) {
			setupObserver(observeTarget);
		} else {
			// Unable to get player element; wait until it is on the page.
			Util.debugLog(
				`Player element (${Connector.playerSelector}) was not found in the page`, 'warn');

			let playerObserver = new MutationObserver(() => {
				observeTarget = document.querySelector(Connector.playerSelector);
				if (observeTarget) {
					Util.debugLog(`Found ${Connector.playerSelector} using second MutationObserver.`);

					playerObserver.disconnect();
					setupObserver(observeTarget);
				}
			});

			let playerObserverConfig = {
				childList: true, subtree: true,
				attributes: false, characterData: false
			};
			playerObserver.observe(document, playerObserverConfig);
		}
	}

	function setupObserver(observeTarget) {
		const observer = new MutationObserver(Connector.onStateChanged);
		const observerConfig = {
			childList: true, subtree: true,
			attributes: true, characterData: true
		};

		observer.observe(observeTarget, observerConfig);
	}
})();
