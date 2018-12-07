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
 */
require([
	'migrate',
	'service/ga',
	'inject',
	'object/inject-result',
	'controller',
	'storage/chrome-storage',
	'config',
	'service/scrobble-service',
	'notifications'
], (Migrate, GA, Inject, InjectResult, Controller, ChromeStorage, Config, ScrobbleService, Notifications) => {

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
	 * Array of versions have notable changes.
	 * @type {Array}
	 */
	const versionsToNotify = [];

	/**
	 * Flag for "page session" where at least single injection occurred
	 * Used for tracking number of actually active users
	 * @type {Boolean}
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
		chrome.tabs.onRemoved.addListener(onTabRemoved);
		chrome.tabs.onActivated.addListener(onTabChanged);

		chrome.runtime.onMessage.addListener(onMessage);
		chrome.runtime.onInstalled.addListener((details) => {
			if (details.reason === 'install') {
				onExtensionInstalled();
			}
		});

		chrome.runtime.onConnect.addListener((port) => {
			port.onMessage.addListener((message) => {
				onPortMessage(message, port.sender);
			});
		});
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

			case 'v2.authenticate': {
				let scrobblerLabel = request.scrobbler;
				let scrobbler = ScrobbleService.getScrobblerByLabel(scrobblerLabel);
				if (scrobbler) {
					authenticateScrobbler(scrobbler);
				}
				break;
			}
		}

		return true;
	}

	/**
	 * Called when something sent message to background script via port.
	 * @param  {Object} message Message object
	 * @param  {Object} sender Message sender
	 */
	function onPortMessage(message, sender) {
		switch (message.type) {
			case 'v2.stateChanged': {
				let ctrl = getControllerByTabId(sender.tab.id);
				if (ctrl) {
					ctrl.onStateChanged(message.data);
				}
				break;
			}
		}
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

		Inject.onTabsUpdated(tab).then((result) => {
			switch (result.type) {
				case InjectResult.NO_MATCH: {
					// Remove controller if any
					unloadController(tabId, true);
					break;
				}

				case InjectResult.MATCHED_BUT_DISABLED:
				case InjectResult.MATCHED_AND_INJECTED: {
					// Remove previous controller if any
					unloadController(tabId);

					let enabled = result.type === InjectResult.MATCHED_AND_INJECTED;
					tabControllers[tabId] = new Controller(tabId, result.connector, enabled);
					chrome.tabs.sendMessage(tabId, { type: 'v2.onReady' });

					GA.event('core', 'inject', result.connector.label);

					if (!isActiveSession) {
						isActiveSession = true;
						GA.pageview(`/background-injected?version=${extVersion}`);
					}
					break;
				}
				/* @ifdef FIREFOX
				// Part of workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1406765
				// FIXME: Remove if this issue is resolved
				case InjectResult.ALREADY_INJECTED: {
					let controller = getControllerByTabId(tabId);
					if (controller) {
						controller.updatePageAction();
					}
					break;
				}
				/* @endif */
			}

			updateContextMenu(tabId);
		}).catch((err) => {
			console.error(err);
		});
	}

	/**
	 * Called when current tab is changed.
	 * @param  {Object} activeInfo Object contains info about current tab
	 */
	function onTabChanged(activeInfo) {
		updateContextMenu(activeInfo.tabId);
	}

	/**
	 * Called when tab is changed.
	 * @param  {Number} tabId Tab ID
	 */
	function onTabRemoved(tabId) {
		unloadController(tabId);
	}

	/**
	 * Called when extension is installed first time.
	 */
	function onExtensionInstalled() {
		openAdd0nComWebsite();
	}

	/**
	 * Create new tab with opened project homepage.
	 * Called on first install.
	 */
	function openAdd0nComWebsite() {
		chrome.tabs.create({ url: 'http://add0n.com/lastfm-scrobbler.html' });
	}

	/**
	 * Create new tab with release notes of current version.
	 * Called after update to version with notable changes.
	 */
	function openChangelogSection() {
		chrome.tabs.create({ url: `https://github.com/web-scrobbler/web-scrobbler/releases/tag/v${extVersion}` });
	}

	/**
	 * Setup context menu of page action icon.
	 * Called when active tab is changed.
	 * @param  {Number} tabId Tab ID
	 */
	function updateContextMenu(tabId) {
		chrome.contextMenus.removeAll();

		let controller = getControllerByTabId(tabId);
		if (!controller) {
			return;
		}
		let connector = controller.getConnector();

		if (controller.isEnabled) {
			let title1 = chrome.i18n.getMessage('menuDisableConnector', connector.label);
			addContextMenuItem(title1, () => {
				controller.setEnabled(false);
				Config.setConnectorEnabled(connector.label, false);

				updateContextMenu(tabId);
			});

			let title2 = chrome.i18n.getMessage('menuDisableUntilTabClosed');
			addContextMenuItem(title2, () => {
				controller.setEnabled(false);
				updateContextMenu(tabId);
			});
		} else {
			let title = chrome.i18n.getMessage('menuEnableConnector', connector.label);
			addContextMenuItem(title, () => {
				controller.setEnabled(true);
				Config.setConnectorEnabled(connector.label, true);
				updateContextMenu(tabId);
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
			title, type, onclick, contexts: ['browser_action'],
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
			return storage.set(data).then(() => {
				// debug log internal storage state for people who send logs (tokens are anonymized)
				storage.debugLog();
			});
		});
	}

	/**
	 * Stop and remove controller for given tab ID.
	 * @param  {Number} tabId Tab ID
	 * @param  {Boolean} hideBrowserAction Should controller reset icon
	 */
	function unloadController(tabId, hideBrowserAction = false) {
		let controller = tabControllers[tabId];

		if (controller) {
			let label = controller.getConnector().label;
			console.log(`Tab ${tabId}: Remove controller for ${label} connector`);

			controller.finish(hideBrowserAction);
			delete tabControllers[tabId];
		}
	}

	/**
	 * Check if current version has notable changes and show
	 * the extension page on add0n.com website.
	 * @return {Promise} Promise that will be resolved when the task has complete
	 */
	function notifyOfNotableChanges() {
		let storage = ChromeStorage.getStorage(ChromeStorage.NOTIFICATIONS);

		if (versionsToNotify.includes(extVersion)) {
			return storage.get().then((data) => {
				if (!data.changelog) {
					data.changelog = {};
				}

				if (!data.changelog[extVersion]) {
					openChangelogSection();
					data.changelog[extVersion] = true;

					return storage.set(data);
				}
			}).then(() => {
				storage.debugLog();
			});
		}

		storage.debugLog();
		return Promise.resolve();
	}

	/**
	 * Ask user for grant access for service covered by given scrobbler.
	 * @param  {Object} scrobbler Scrobbler instance
	 */
	function authenticateScrobbler(scrobbler) {
		scrobbler.getAuthUrl().then((authUrl) => {
			ScrobbleService.bindScrobbler(scrobbler);
			chrome.tabs.create({ url: authUrl });
		}).catch(() => {
			console.log(`Unable to get auth URL for ${scrobbler.getLabel()}`);

			Notifications.showSignInError(scrobbler, () => {
				let statusUrl = scrobbler.getStatusUrl();
				if (statusUrl) {
					chrome.tabs.create({ url: statusUrl });
				}
			});
		});
	}

	/**
	 * Called on the extension start.
	 */
	function startup() {
		Migrate.migrate().then(() => {
			updateVersionInStorage().then(notifyOfNotableChanges);
			setupChromeEventListeners();

			// track background page loaded - happens once per browser session
			GA.pageview(`/background-loaded?version=${extVersion}`);

			ScrobbleService.bindAllScrobblers().then((boundScrobblers) => {
				if (boundScrobblers.length === 0) {
					console.warn('No scrobblers are bound');

					let authUrl = chrome.extension.getURL('/options/options.html#accounts');
					Notifications.showAuthNotification(() => {
						chrome.tabs.create({ url: authUrl });

						GA.event('core', 'auth', 'default');
					}).catch(() => {
						// Fallback for browsers with no notifications support
						chrome.tabs.create({ url: authUrl });

						GA.event('core', 'auth', 'fallback');
					});
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
