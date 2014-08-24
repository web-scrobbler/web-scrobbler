'use strict';

/**
 * Background script entry point
 */
require([
	'legacy/scrobbler',
	'services/background-ga',
	'services/lastfm',
	'notifications',
	'inject',
	'injectResult',
	'controller',
	'config'
], function(legacyScrobbler, GA, LastFM, Notifications, inject, injectResult, Controller, config) {

	/**
	 * Single controller instance for each tab with injected script
	 * This allows us to work with tabs independently
	 */
	var tabControllers = {};


	/**
	 * Callback for injecting script
	 *
	 * @param {InjectResult} result
	 */
	var injectCb = function(result) {
		var tabId = result.getTabId();

		// no match - do cleanup
		if (result.getResult() === injectResult.results.NO_MATCH) {
			// remove controller if any
			if (tabControllers[tabId] !== undefined) {
				delete tabControllers[tabId];
			}

			// hide action icon - there may be any
			try {
				chrome.pageAction.hide(tabId);
			} catch (e) {
				// ignore, the tab may no longer exist
			}
			return;
		}

		// matched, but the connector is disabled
		if (result.getResult() === injectResult.results.MATCHED_BUT_DISABLED) {
			legacyScrobbler.setActionIcon(config.ACTION_SITE_DISABLED, tabId);
			return;
		}

		// matched, create controller if needed
		if (result.getResult() === injectResult.results.MATCHED_AND_INJECTED) {
			// controllers are used for v2 connectors only
			if (result.getConnector().version === 2) {
				// intentionally overwrite previous controller, if any
				tabControllers[tabId] = new Controller(tabId, result.getConnector());
			}

			// show 'recognized' action icon until the track info is recognized and validated
			legacyScrobbler.setActionIcon(config.ACTION_SITE_RECOGNIZED, tabId);
			return;
		}
	};





	// --- done once on background script load -------------------------------------------------------------------------


	// setup listener for messages from connectors
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		switch (request.type) {
			// Interface for new V2 functionality. Routes control flow to new structures, so we can
			// have two cores side by side. The old functionality will be later removed
			case 'v2.stateChanged':
				var tabId = sender.tab.id;
				if (tabControllers[tabId] !== undefined) {
					tabControllers[tabId].onStateChanged(request.state);
				} else {
					console.error('Controller for tab ' + tabId + ' not found');
				}
				break;

			// Redirect all other messages to legacy listener
			default:
				legacyScrobbler.runtimeOnMessage(request, sender, sendResponse);
		}

		return true;
	});

	//setup listener for tab updates
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		// wait for navigation to complete (this does not mean page onLoad)
		if (changeInfo.status !== 'complete') {
			return;
		}

		inject.onTabsUpdated(tabId, changeInfo, tab, injectCb);
	});


	// track background page loaded - happens once per browser session
	GA.send('pageview');

	// check session ID status and show notification if authentication is needed
	var lfmSessionId = LastFM.getSessionID();
	if (!lfmSessionId) {
		var authUrl = LastFM.getAuthUrl();
		if (authUrl) {
			console.info('LastFM: No session ID, requesting authentication');
			Notifications.showAuthenticate(authUrl);
		} else {
			Notifications.showError('Error obtaining API token. See console for details');
		}
	} else {
		console.info('LastFM: Session ID ' + lfmSessionId);
	}

});
