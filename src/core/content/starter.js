'use strict';

/* global Connector, BaseConnector, Reactor, TestReporter */

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
		console.warn('Web Scrobbler: Starter already loaded');
		return;
	}
	window.STARTER_LOADED = true;

	// Warnings to help developers with their custom connectors
	if (typeof(Connector) === 'undefined' || !(Connector instanceof BaseConnector)) {
		console.warn('Web Scrobbler: You have overwritten or unset the Connector object!');
		return;
	}

	// Observe state and communicates with background script.
	new Reactor(Connector);

	// Set up Mutation observing as a default state change detection
	if (Connector.playerSelector !== null) {
		console.log('Web Scrobbler: Setting up observer');

		let observeTarget = document.querySelector(Connector.playerSelector);
		let observer = new MutationObserver(Connector.onStateChanged);
		let observerConfig = {
			childList: true, subtree: true,
			attributes: true, characterData: true
		};

		if (observeTarget !== null) {
			observer.observe(observeTarget, observerConfig);
		} else {
			// Unable to get player element; wait until it is on the page.
			console.warn(`Web Scrobbler: Player element (${Connector.playerSelector}) was not found in the page.`);

			let playerObserver = new MutationObserver(() => {
				observeTarget = document.querySelector(Connector.playerSelector);
				if (observeTarget) {
					console.log(`Web Scrobbler: found ${Connector.playerSelector} using second MutationObserver.`);

					playerObserver.disconnect();

					observer.observe(observeTarget, observerConfig);
					// @ifdef DEBUG
					TestReporter.reportPlayerElementExists();
					// @endif
				}
			});

			let playerObserverConfig = {
				childList: true, subtree: true,
				attributes: false, characterData: false
			};
			playerObserver.observe(document, playerObserverConfig);
		}
	} else {
		/**
		 * Player selector is not provided, current connector needs
		 * to detect state changes on its own.
		 */
		console.info('Web Scrobbler: Connector.playerSelector is empty. The current connector is expected to manually detect state changes');
	}

	// @ifdef DEBUG
	/**
	 * Setup event listener to wait an event from the test suite. The test suite will send
	 * this event after configuring the test capture. That means we can start to send events
	 * to the test suite.
	 */
	console.info('Web Scrobbler: waiting for test capture to be configured');
	document.addEventListener('web-scrobbler-test-capture-setup', () => {
		TestReporter.reportInjection(Connector);
	});

	/**
	 * In addition, send events w/o waiting for the extension event.
	 */
	TestReporter.reportInjection(Connector);
	// @endif
})();
