'use strict';

define((require) => {
	const GA = require('service/ga');
	const browser = require('webextension-polyfill');
	const TabWorker = require('object/tab-worker');
	const Notifications = require('browser/notifications');
	const BrowserStorage = require('storage/browser-storage');
	const ScrobbleService = require('object/scrobble-service');

	const {
		REQUEST_GET_ACTIVE_TAB_ID,
		REQUEST_SIGN_IN,
		REQUEST_SIGN_OUT,
		REQUEST_APPLY_USER_PROPERTIES,
	} = require('@/common/messages');
	const { openTab } = require('util/util-browser');

	const {
		ControllerReset, SongNowPlaying, SongScrobbled, SongUnrecognized,
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
			this.tabWorker.onConnectorActivated = ({ label }) => {
				GA.event('core', 'inject', label);
				this.setSessionActive();
			};
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

			GA.pageview(`/background-loaded?version=${this.extVersion}`);
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

			browser.tabs.onUpdated.addListener((_, changeInfo, tab) => {
				if (changeInfo.status !== 'complete') {
					return;
				}

				return this.tabWorker.processTabUpdate(tab.id, tab.url);
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
			if (tabId) {
				return this.tabWorker.processMessage(tabId, type, data);
			}

			switch (type) {
				case REQUEST_GET_ACTIVE_TAB_ID:
					return this.tabWorker.getActiveTabId();
			}

			const scrobbler = ScrobbleService.getScrobblerById(
				data.scrobblerId
			);
			if (!scrobbler) {
				console.log(`Unknown scrobbler ID: ${data.scrobblerId}`);
				return;
			}

			switch (type) {
				case REQUEST_SIGN_IN:
					this.authenticateScrobbler(scrobbler);
					break;

				case REQUEST_SIGN_OUT:
					await scrobbler.signOut();
					break;

				case REQUEST_APPLY_USER_PROPERTIES:
					await this.applyUserProperties(scrobbler, data.userProps);
					break;
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
			GA.pageview(`/background-injected?version=${this.extVersion}`);
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
					const { label } = ctrl.getConnector();

					Notifications.showNowPlaying(song, label, () => {
						openTab(ctrl.tabId);
					});
					break;
				}

				case SongScrobbled: {
					const { label } = ctrl.getConnector();
					GA.event('core', 'scrobble', label);
					break;
				}

				case SongUnrecognized: {
					const song = ctrl.getCurrentSong();
					Notifications.showSongNotRecognized(song, () => {
						openTab(ctrl.tabId);
					});
					break;
				}
			}
		}
	}

	return Extension;
});
