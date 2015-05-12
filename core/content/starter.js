'use strict';
/* globals Connector, BaseConnector, Reactor */

/**
 * This script is injected to the page after the {@link BaseConnector} and a custom
 * connector are already in place and set up
 *
 * As custom connectors should be declarative only without any actions triggered
 * on pageload, this starter is needed for connectors to start running
 */
(function () {
	// intentionally global lock to avoid multiple execution of this function
	if (window.STARTER_LOADED !== undefined) {
		console.warn('starter already loaded');
		return;
	}
	window.STARTER_LOADED = true;


	/**
	 * Warnings to help developers with their custom connectors
	 */
	if (typeof(Connector) == 'undefined' || !(Connector instanceof BaseConnector)) {
		console.warn('Web Scrobbler: You have overwritten or unset the Connector object!');
		return;
	}

	// observes state and communicates with background script
	var reactor = new Reactor(Connector);

	/**
	 * Set up Mutation observing as a default state change detection
	 */
	if (Connector.playerSelector !== null) {
		console.log('Web Scrobbler: Setting up observer');

		var observer = new MutationObserver(Connector.onStateChanged);

		var observeTarget = document.querySelector(Connector.playerSelector);
		var config = {
			childList: true,
			subtree: true,
			attributes: true,
			characterData: true
		};
		observer.observe(observeTarget, config);
	}
	/**
	 * Player selector is not provided, current connector needs to detect state changes on its own
	 */
	else {
		console.info('Web Scrobbler: Connector.playerSelector is empty. The current connector is expected to manually detect state changes');
	}

	/**
	 * Automatically reset on window unload
	 */
	$(window).unload(function() {
		reactor.sendStateToBackground({});
		return true;
	});

})();
