'use strict';

/**
 * The extension uses `browser.runtime.sendMessage` function for communication
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

define((require) => {
	const browser = require('webextension-polyfill');
	const TabWorker = require('object/tab-worker');
	const Notifications = require('browser/notifications');
	const BrowserStorage = require('storage/browser-storage');
	const ScrobbleService = require('object/scrobble-service');

	const { openTab } = require('util/util-browser');

	const {
		ControllerReset, SongNowPlaying, SongUnrecognized,
	} = require('object/controller-event');

	/**
	 * How many times to show auth notification.
	 *
	 * @type {Number}
	 */
	const authNotificationDisplayCount = 3;

	class Extension {
		constructor() {
			this.isSessionActive = false;
			this.extVersion = browser.runtime.getManifest().version;
			this.notificationStorage = BrowserStorage.getStorage(
				BrowserStorage.NOTIFICATIONS
			);
			this.tabWorker = new TabWorker(this);
			this.tabWorker.onControllerEvent = (ctrl, event) => {
				this.processControllerEvent(ctrl, event);
			};

			this.initializeListeners();
		}

		/**
		 * Entry point.
		 */
		async start() {
			await this.updateVersionInStorage();

			if (!await this.bindScrobblers()) {
				console.warn('No scrobblers are bound');

				this.showAuthNotification();
			}
		}

		/** Private functions. */

		initializeListeners() {
			browser.runtime.onMessage.addListener((request) => {
				const { tabId, type, data } = request;

				return this.processMessage(tabId, type, data);
			});

			try {
				browser.commands.onCommand.addListener((command) => {
					return this.tabWorker.processCommand(command);
				});
			} catch (e) {
				// Don't let the extension fail on Firefox for Android.
			}

			browser.tabs.onUpdated.addListener(async (_, changeInfo, tab) => {

				if (changeInfo.status !== 'complete') {
					return;
				}

				// Workaround for weird bug where the url is not returned.
				// This is weird, this is stupid, but it breaks with some extensions like teleparty without this code for some reason.
				let url = tab.url;
				if (typeof url === 'undefined') {
					url = await browser.tabs.get(tab.id).then((idTab) => idTab.url);
				}

				return this.tabWorker.processTabUpdate(tab.id, url);
			});

			browser.tabs.onRemoved.addListener((tabId) => {
				return this.tabWorker.processTabRemove(tabId);
			});

			browser.tabs.onActivated.addListener((activeInfo) => {
				return this.tabWorker.processTabChange(activeInfo.tabId);
			});

			browser.runtime.onConnect.addListener((port) => {
				port.onMessage.addListener((message) => {
					const { type, data } = message;
					const tabId = port.sender.tab.id;

					return this.tabWorker.processPortMessage(tabId, type, data);
				});
			});
		}

		/**
		 * Called when something sent message to the background script
		 * via `browser.runtime.sendMessage` function.
		 *
		 * @param  {Number} tabId ID of a tab to which the message is addressed
		 * @param  {String} type Message type
		 * @param  {Object} data Object contains data sent in the message
		 */
		async processMessage(tabId, type, data) {
			const requestTypes = [
				'REQUEST_AUTHENTICATE',
				'REQUEST_APPLY_USER_OPTIONS',
				'REQUEST_SIGN_OUT',
			];
			if (!requestTypes.includes(type)) {
				return this.tabWorker.processMessage(tabId, type, data);
			}

			const scrobbler = ScrobbleService.getScrobblerByLabel(data.label);
			if (!scrobbler) {
				console.log(`Unknown scrobbler: ${data.label}`);
				return;
			}

			if (type === 'REQUEST_AUTHENTICATE') {
				this.authenticateScrobbler(scrobbler);
			} else if (type === 'REQUEST_APPLY_USER_OPTIONS') {
				await this.applyUserProperties(scrobbler, data.userProps);
			} else if (type === 'REQUEST_SIGN_OUT') {
				await scrobbler.signOut();
			}
		}

		/**
		 * Replace the extension version stored in local storage by current one.
		 */
		async updateVersionInStorage() {
			const storage = BrowserStorage.getStorage(BrowserStorage.CORE);
			const data = await storage.get();

			data.appVersion = this.extVersion;
			await storage.set(data);

			storage.debugLog();
		}

		/**
		 * Ask a scrobble service to bind scrobblers.
		 *
		 * @return {Boolean} True if at least one scrobbler is registered;
		 *                   false if no scrobblers are registered
		 */
		async bindScrobblers() {
			const boundScrobblers = await ScrobbleService.bindAllScrobblers();
			return boundScrobblers.length > 0;
		}

		async showAuthNotification() {
			if (await this.isAuthNotificationAllowed()) {
				const authUrl = browser.runtime.getURL('/ui/options/index.html#accounts');
				try {
					await Notifications.showAuthNotification(() => {
						browser.tabs.create({ url: authUrl });
					});
				} catch (e) {
					// Fallback for browsers with no notifications support.
					browser.tabs.create({ url: authUrl });
				}

				await this.updateAuthDisplayCount();
			}
		}

		/**
		 * Ask user for grant access for service covered by given scrobbler.
		 *
		 * @param  {Object} scrobbler Scrobbler instance
		 */
		async authenticateScrobbler(scrobbler) {
			try {
				const authUrl = await scrobbler.getAuthUrl();

				ScrobbleService.bindScrobbler(scrobbler);
				browser.tabs.create({ url: authUrl });
			} catch (e) {
				console.log(`Unable to get auth URL for ${scrobbler.getLabel()}`);

				Notifications.showSignInError(scrobbler, () => {
					const statusUrl = scrobbler.getStatusUrl();
					if (statusUrl) {
						browser.tabs.create({ url: statusUrl });
					}
				});
			}
		}

		async applyUserProperties(scrobbler, userProps) {
			await scrobbler.applyUserProperties(userProps);
			ScrobbleService.bindScrobbler(scrobbler);
		}

		/**
		 * Check if extension should display auth notification.
		 *
		 * @return {Boolean} Check result
		 */
		async isAuthNotificationAllowed() {
			const data = await this.notificationStorage.get();

			const authDisplayCount = data.authDisplayCount || 0;
			return authDisplayCount < authNotificationDisplayCount;
		}

		/**
		 * Update internal counter of displayed auth notifications.
		 */
		async updateAuthDisplayCount() {
			const data = await this.notificationStorage.get();
			const authDisplayCount = data.authDisplayCount || 0;

			data.authDisplayCount = authDisplayCount + 1;
			await this.notificationStorage.set(data);
		}

		/**
		 * Send a `pageview` event to GA to indicate this session is active.
		 * Do nothing if it's already marked as an active.
		 */
		setSessionActive() {
			if (this.isSessionActive) {
				return;
			}

			this.isSessionActive = true;
		}

		/**
		 * Called when a controller generates a new event.
		 *
		 * @param  {Object} ctrl  Controller instance
		 * @param  {Number} event Event generated by the controller
		 */
		processControllerEvent(ctrl, event) {
			switch (event) {
				case ControllerReset: {
					const song = ctrl.getCurrentSong();
					if (song) {
						Notifications.clearNowPlaying(song);
					}
					break;
				}

				case SongNowPlaying: {
					const song = ctrl.getCurrentSong();
					if (song.flags.isReplaying) {
						return;
					}

					Notifications.showNowPlaying(song, ctrl.connector, () => {
						openTab(ctrl.tabId);
					});
					break;
				}

				case SongUnrecognized: {
					const song = ctrl.getCurrentSong();
					Notifications.showSongNotRecognized(song, ctrl.connector, () => {
						openTab(ctrl.tabId);
					});
					break;
				}
			}
		}
	}

	return Extension;
});
