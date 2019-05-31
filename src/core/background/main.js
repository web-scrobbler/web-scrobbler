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
 *  - EVENT_STATE_CHANGED: The connector state is changed
 *    @param  {Object} state Connector state
 *  - EVENT_SONG_UPDATED: The current song is updated
 *    @param  {Object} data Song instance copy
 *  - EVENT_READY: The connector is injected and the controller is created
 *  - EVENT_PING: The 'ping' event to check if connector is injected
 *
 * 2) requests:
 *  - REQUEST_GET_SONG: Get now playing song
 *    @return {Object} Song instance copy
 *  - REQUEST_CORRECT_SONG: Correct song info
 *    @param  {Object} data Object contains corrected song info
 *  - REQUEST_TOGGLE_LOVE: Toggle song love status
 *    @param  {Boolean} isLoved Flag indicates song is loved
 *  - REQUEST_RESET_SONG: Reset corrected song info
 *  - REQUEST_SKIP_SONG: Ignore (don't scrobble) current song
 *  - REQUEST_AUTHENTICATE: Authenticate scrobbler
 *    @param  {String} scrobbler Scrobbler label
 */
require([
	'util/migrate',
	'service/ga',
	'browser/inject',
	'object/inject-result',
	'object/controller',
	'storage/chrome-storage',
	'storage/options',
	'object/scrobble-service',
	'browser/notifications'
], (Migrate, GA, Inject, InjectResult, Controller, ChromeStorage, Options, ScrobbleService, Notifications) => {
	/**
	 * How many times to show auth notification.
	 * @type {Number}
	 */
	const AUTH_NOTIFICATION_DISPLAY_COUNT = 3;

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

	const notificationStorage = ChromeStorage.getStorage(ChromeStorage.NOTIFICATIONS);

	/**
	 * Setup Chrome event listeners. Called on startup.
	 */
	function setupChromeEventListeners() {
		chrome.tabs.onUpdated.addListener(onTabUpdated);
		chrome.tabs.onRemoved.addListener(onTabRemoved);
		chrome.tabs.onActivated.addListener(onTabChanged);

		chrome.runtime.onMessage.addListener(onMessage);
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
	 */
	function onMessage(request, sender, sendResponse) {
		if (request.type === 'REQUEST_AUTHENTICATE') {
			const scrobblerLabel = request.scrobbler;
			const scrobbler = ScrobbleService.getScrobblerByLabel(scrobblerLabel);

			if (scrobbler) {
				authenticateScrobbler(scrobbler);
			}

			return;
		}


		const tabId = request.tabId;
		const ctrl = tabControllers[tabId];

		if (!ctrl) {
			console.warn(
				`Attempted to send event to controller for tab ${tabId}`);
			return;
		}

		switch (request.type) {
			case 'REQUEST_GET_SONG':
				sendResponse(ctrl.getCurrentSong());
				break;

			case 'REQUEST_CORRECT_SONG':
				ctrl.setUserSongData(request.data);
				break;

			case 'REQUEST_TOGGLE_LOVE':
				ctrl.toggleLove(request.data.isLoved).then(() => {
					sendResponse(request.data.isLoved);
				});
				break;

			case 'REQUEST_SKIP_SONG':
				ctrl.skipCurrentSong();
				break;

			case 'REQUEST_RESET_SONG':
				ctrl.resetSongData();
				break;
		}
	}

	/**
	 * Called when something sent message to background script via port.
	 * @param  {Object} message Message object
	 * @param  {Object} sender Message sender
	 */
	function onPortMessage(message, sender) {
		switch (message.type) {
			case 'EVENT_STATE_CHANGED': {
				let ctrl = tabControllers[sender.tab.id];
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
	async function onTabUpdated(tabId, changeInfo, tab) {
		// wait for navigation to complete (this does not mean page onLoad)
		if (changeInfo.status !== 'complete') {
			return;
		}

		let result = await Inject.onTabsUpdated(tab);
		switch (result.type) {
			case InjectResult.NO_MATCH: {
				unloadController(tabId);
				break;
			}

			case InjectResult.MATCHED_BUT_DISABLED:
			case InjectResult.MATCHED_AND_INJECTED: {
				unloadController(tabId);

				let enabled = result.type === InjectResult.MATCHED_AND_INJECTED;
				tabControllers[tabId] = new Controller(tabId, result.connector, enabled);
				chrome.tabs.sendMessage(tabId, { type: 'EVENT_READY' });

				GA.event('core', 'inject', result.connector.label);

				if (!isActiveSession) {
					isActiveSession = true;
					GA.pageview(`/background-injected?version=${extVersion}`);
				}
				break;
			}
		}

		updateContextMenu(tabId);
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

		let controller = tabControllers[tabId];
		if (!controller) {
			return;
		}
		let connector = controller.getConnector();

		if (controller.isEnabled) {
			let title1 = chrome.i18n.getMessage('menuDisableConnector', connector.label);
			addContextMenuItem(title1, () => {
				controller.setEnabled(false);
				Options.setConnectorEnabled(connector.label, false);

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
				Options.setConnectorEnabled(connector.label, true);
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
	 */
	async function updateVersionInStorage() {
		let storage = ChromeStorage.getStorage(ChromeStorage.CORE);
		let data = await storage.get();

		data.appVersion = extVersion;
		await storage.set(data);

		storage.debugLog();
	}

	/**
	 * Stop and remove controller for given tab ID.
	 * @param  {Number} tabId Tab ID
	 */
	function unloadController(tabId) {
		let controller = tabControllers[tabId];

		if (controller) {
			let label = controller.getConnector().label;
			console.log(`Tab ${tabId}: Remove controller for ${label} connector`);

			controller.finish();
			delete tabControllers[tabId];
		}
	}

	/**
	 * Check if current version has notable changes
	 * and show changelog on GitHub.
	 */
	async function notifyOfNotableChanges() {
		if (versionsToNotify.includes(extVersion)) {
			let data = await notificationStorage.get();
			if (!data.changelog) {
				data.changelog = {};
			}

			if (!data.changelog[extVersion]) {
				openChangelogSection();
				data.changelog[extVersion] = true;

				await notificationStorage.set(data);
			}

			await notificationStorage.debugLog();
		}

		notificationStorage.debugLog();
	}

	/**
	 * Ask user for grant access for service covered by given scrobbler.
	 * @param  {Object} scrobbler Scrobbler instance
	 */
	async function authenticateScrobbler(scrobbler) {
		try {
			let authUrl = await scrobbler.getAuthUrl();

			ScrobbleService.bindScrobbler(scrobbler);
			chrome.tabs.create({ url: authUrl });
		} catch (e) {
			console.log(`Unable to get auth URL for ${scrobbler.getLabel()}`);

			Notifications.showSignInError(scrobbler, () => {
				let statusUrl = scrobbler.getStatusUrl();
				if (statusUrl) {
					chrome.tabs.create({ url: statusUrl });
				}
			});
		}
	}

	/**
	 * Check if extension should display auth notification.
	 * @return {Boolean} Check result
	 */
	async function isAuthNotificationAllowed() {
		const data = await notificationStorage.get();

		const authDisplayCount = data.authDisplayCount || 0;
		return authDisplayCount < AUTH_NOTIFICATION_DISPLAY_COUNT;
	}

	/**
	 * Update internal counter of displayed auth notifications.
	 */
	async function updateAuthDisplayCount() {
		const data = await notificationStorage.get();
		const authDisplayCount = data.authDisplayCount || 0;

		data.authDisplayCount = authDisplayCount + 1;
		await notificationStorage.set(data);
	}

	/**
	 * Called on the extension start.
	 */
	async function startup() {
		await updateVersionInStorage();
		await notifyOfNotableChanges();
		setupChromeEventListeners();

		// track background page loaded - happens once per browser session
		GA.pageview(`/background-loaded?version=${extVersion}`);

		let boundScrobblers = await ScrobbleService.bindAllScrobblers();
		if (boundScrobblers.length > 0) {
			for (let scrobbler of boundScrobblers) {
				GA.event('core', 'bind', scrobbler.getLabel());
			}
		} else {
			console.warn('No scrobblers are bound');

			if (await isAuthNotificationAllowed()) {
				let authUrl = chrome.runtime.getURL('/options/options.html#accounts');
				try {
					await Notifications.showAuthNotification(() => {
						chrome.tabs.create({ url: authUrl });
					});

					GA.event('core', 'auth', 'default');
				} catch (e) {
					// Fallback for browsers with no notifications support
					chrome.tabs.create({ url: authUrl });

					GA.event('core', 'auth', 'fallback');
				}

				await updateAuthDisplayCount();
			}
		}
	}

	startup();
});
