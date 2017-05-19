'use strict';

/**
 * Background script entry point
 *
 * - sets up injecting mechanism for supported sites
 * - creates controllers for each recognized tab
 * - sets up all chrome.* listeners, which are forwarded controllers if needed
 * - checks auth status on run (browser start or extension enabling) and prompts for login if needed
 *
 * The extension uses `chrome.runtime.sendMessage` function for communication
 * between different modules using the following message types:
 *
 * 1) events:
 *  - v2.stateChanged: The connector state is changed
 *    @param  {Object} state Connector state
 *  - v2.songUpdated: The current song is updated
 *    @param  {Object} data Song instance copy
 *  - v2.onReady: The connector is injected and the controller is created
 *  - v2.onPing: The 'ping' event to check if connector is injected
 *
 * 2) requests:
 *  - v2.getSong: Get now playing song
 *    @return {Object} Song instance copy
 *  - v2.correctSong: Correct song info
 *    @param  {Object} data Object contains corrected song info
 *  - v2.toggleLove: Toggle song love status
 *    @param  {Boolean} isLoved Flag indicates song is loved
 *  - v2.resetSongData: Reset corrected song info
 *  - v2.skipSong: Ignore (don't scrobble) current song
 *  - v2.authenticate: Authenticate scrobbler
 *    @param  {String} scrobbler Scrobbler label
 *    @param  {Boolean} notify Use notification
 */
require([
	'migrate',
	'services/background-ga',
	'inject',
	'objects/injectResult',
	'pageAction',
	'controller',
	'storage/chromeStorage',
	'config',
	'services/scrobbleService'
], function(Migrate, GA, inject, InjectResult, PageAction, Controller, ChromeStorage, Config, ScrobbleService) {

	/**
	 * Current version of the extension.
	 * @type {String}
	 */
	const extVersion = chrome.runtime.getManifest().version;

	/**
	 * Single controller instance for each tab with injected script
	 * This allows us to work with tabs independently
	 */
	const tabControllers = {};

	/**
	 * Flag for "page session" where at least single injection occurred
	 * Used for tracking number of actually active users
	 * @type {boolean}
	 */
	let isActiveSession = false;

	/**
	 * Return controller for given tab. There should always be one.
	 * @param  {Number} tabId Tab ID
	 * @return {Object} Controller instance for tab
	 */
	function getControllerByTabId(tabId) {
		return tabControllers[tabId];
	}

	/**
	 * Setup Chrome event listeners. Called on startup.
	 */
	function setupChromeEventListeners() {
		chrome.tabs.onUpdated.addListener(onTabUpdated);
		chrome.tabs.onRemoved.addListener(unloadController);
		chrome.tabs.onActivated.addListener(onTabChanged);

		chrome.runtime.onMessage.addListener(onMessage);
	}

	/**
	 * Called when something sent message to background script.
	 * @param  {Any} request Message sent by the calling script
	 * @param  {Object} sender Message sender
	 * @param  {Function} sendResponse Response callback
	 * @return {Boolean} True value
	 */
	function onMessage(request, sender, sendResponse) {
		let ctrl;

		switch (request.type) {
			case 'v2.stateChanged':
				ctrl = getControllerByTabId(sender.tab.id);
				if (ctrl) {
					ctrl.onStateChanged(request.state);
				}
				break;

			case 'v2.getSong':
				ctrl = getControllerByTabId(request.tabId);
				if (ctrl) {
					sendResponse(ctrl.getCurrentSong()); // object or null
				}
				break;

			case 'v2.correctSong':
				ctrl = getControllerByTabId(request.tabId);
				if (ctrl) {
					ctrl.setUserSongData(request.data);
				}
				break;

			case 'v2.toggleLove':
				ctrl = getControllerByTabId(request.tabId);
				if (ctrl) {
					ctrl.toggleLove(request.data.isLoved).then(sendResponse);
				}
				break;

			case 'v2.skipSong':
				ctrl = getControllerByTabId(request.tabId);
				if (ctrl) {
					ctrl.skipCurrentSong();
				}
				break;

			case 'v2.resetSongData':
				ctrl = getControllerByTabId(request.tabId);
				if (ctrl) {
					ctrl.resetSongData();
				}
				break;

			case 'v2.authenticate':
				let scrobblerLabel = request.scrobbler;
				let scrobbler = ScrobbleService.getScrobblerByLabel(scrobblerLabel);
				if (scrobbler) {
					ScrobbleService.authenticateScrobbler(scrobbler, request.notify);
				}
				break;
		}

		return true;
	}

	/**
	 * Called when tab is updated.
	 * @param  {Number} tabId Tab ID
	 * @param  {Object} changeInfo Object contains changes of updated tab
	 * @param  {Objeect} tab State of updated tab
	 */
	function onTabUpdated(tabId, changeInfo, tab) {
		// wait for navigation to complete (this does not mean page onLoad)
		if (changeInfo.status !== 'complete') {
			return;
		}

		inject.onTabsUpdated(tab).then((result) => {
			if (!result) {
				return;
			}

			let tabId = result.tabId;
			switch (result.type) {
				case InjectResult.NO_MATCH: {
					// Remove controller if any
					unloadController(tabId);

					try {
						chrome.pageAction.hide(tabId);
					} catch (e) {
						// ignore, the tab may no longer exist
					}
					break;
				}

				case InjectResult.MATCHED_BUT_DISABLED:
				case InjectResult.MATCHED_AND_INJECTED: {
					// Remove previous controller if any
					unloadController(tabId);

					let enabled = result.type === InjectResult.MATCHED_AND_INJECTED;
					tabControllers[tabId] = new Controller(tabId, result.connector, enabled);
					chrome.tabs.sendMessage(tabId, { type: 'v2.onReady' });

					setupContextMenu(tabId);

					GA.event('core', 'inject', result.connector.label);

					if (!isActiveSession) {
						isActiveSession = true;
						GA.pageview(`/background-injected?version=${extVersion}`);
					}
					break;
				}
			}
		});
	}

	/**
	 * Called when current tab is changed.
	 * @param  {Object} activeInfo Object contains info about current tab
	 */
	function onTabChanged(activeInfo) {
		setupContextMenu(activeInfo.tabId);
	}

	/**
	 * Setup context menu of page action icon.
	 * Called when active tab is changed.
	 * @param  {Number} tabId Tab ID
	 */
	function setupContextMenu(tabId) {
		chrome.contextMenus.removeAll();

		let controller = getControllerByTabId(tabId);
		if (!controller) {
			return;
		}
		let connector = controller.getConnector();

		if (controller.isEnabled()) {
			addContextMenuItem(`Disable ${connector.label} connector`, () => {
				controller.setEnabled(false);
				Config.setConnectorEnabled(connector.label, false);

				setupContextMenu(tabId);
			});
			addContextMenuItem('Disable connector until tab is closed', () => {
				controller.setEnabled(false);
				setupContextMenu(tabId);
			});
		} else {
			addContextMenuItem(`Enable ${connector.label} connector`, () => {
				controller.setEnabled(true);
				Config.setConnectorEnabled(connector, true);
				setupContextMenu(tabId);
			});
		}

		addContextMenuItem(null, null, 'separator');
	}

	/**
	 * Helper function to add item to page action context menu.
	 * @param {String} title Item title
	 * @param {Function} onclick Function that will be called on item click
	 * @param {String} [type='normal'] Item type
	 */
	function addContextMenuItem(title, onclick, type = 'normal') {
		chrome.contextMenus.create({
			title, type, onclick, contexts: ['page_action'],
		});
	}

	/**
	 * Replace the extension version stored in
	 * local storage by current one.
	 * @return {Promise} Promise that will be resolved when the task has complete
	 */
	function updateVersionInStorage() {
		let storage = ChromeStorage.getStorage(ChromeStorage.CORE);
		return storage.get().then((data) => {
			data.appVersion = extVersion;
			storage.set(data).then(() => {
				// debug log internal storage state for people who send logs (tokens are anonymized)
				storage.debugLog();
			});
		});
	}

	/**
	 * Stop and remove controller for given tab ID.
	 * @param  {Number} tabId Tab ID
	 */
	function unloadController(tabId) {
		if (tabControllers[tabId]) {
			console.log(`Tab ${tabId}: remove controller`);

			tabControllers[tabId].resetState();
			delete tabControllers[tabId];
		}
	}

	/**
	 * Called on the extension start.
	 */
	function startup() {
		Migrate.migrate().then(() => {
			updateVersionInStorage();
			setupChromeEventListeners();

			// track background page loaded - happens once per browser session
			GA.pageview(`/background-loaded?version=${extVersion}`);

			let scrobblers = ScrobbleService.getRegisteredScrobblers();
			ScrobbleService.bindScrobblers(scrobblers).then((boundScrobblers) => {
				if (boundScrobblers.length === 0) {
					console.warn('No scrobblers are bound');
					for (let scrobbler of scrobblers) {
						ScrobbleService.authenticateScrobbler(scrobbler);
					}
				} else {
					for (let scrobbler of boundScrobblers) {
						GA.event('core', 'bind', scrobbler.getLabel());
					}
				}
			});
		});
	}

	startup();
});
