import { commands, runtime, tabs } from 'webextension-polyfill';

import BrowserStorage from '@/background/storage/browser-storage';
import Notifications from '@/background/browser/notifications';
import ScrobbleService from '@/background/object/scrobble-service';
import TabWorker from '@/background/object/tab-worker';

import { openTab } from '@/common/util-browser';

import {
	REQUEST_GET_ACTIVE_TAB_ID,
	REQUEST_SIGN_IN,
	REQUEST_SIGN_OUT,
	REQUEST_APPLY_USER_PROPERTIES,
} from '@/common/messages';

import {
	ControllerReset,
	SongNowPlaying,
	SongUnrecognized,
} from '@/background/object/controller-event';

/**
 * How many times to show auth notification.
 */
const authNotificationDisplayCount = 3;

export default class Extension {
	constructor() {
		this.extVersion = runtime.getManifest().version;
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
		runtime.onMessage.addListener((request) => {
			const { tabId, type, data } = request;

			return this.processMessage(tabId, type, data);
		});

		try {
			commands.onCommand.addListener((command) => {
				return this.tabWorker.processCommand(command);
			});
		} catch (e) {
			// Don't let the extension fail on Firefox for Android.
		}

		tabs.onUpdated.addListener((_, changeInfo, tab) => {
			if (changeInfo.status !== 'complete') {
				return;
			}

			return this.tabWorker.processTabUpdate(tab.id, tab.url);
		});

		tabs.onRemoved.addListener((tabId) => {
			return this.tabWorker.processTabRemove(tabId);
		});

		tabs.onActivated.addListener((activeInfo) => {
			return this.tabWorker.processTabChange(activeInfo.tabId);
		});

		runtime.onConnect.addListener((port) => {
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
	 * @param {Number} tabId ID of a tab to which the message is addressed
	 * @param {String} type Message type
	 * @param {Object} data Object contains data sent in the message
	 */
	async processMessage(tabId, type, data) {
		if (tabId) {
			return this.tabWorker.processMessage(tabId, type, data);
		}

		switch (type) {
			case REQUEST_GET_ACTIVE_TAB_ID:
				return this.tabWorker.getActiveTabId();
		}

		const scrobbler = ScrobbleService.getScrobblerById(data.scrobblerId);
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
			const authUrl = runtime.getURL(
				'/ui/options/index.html#accounts'
			);
			try {
				await Notifications.showAuthNotification(() => {
					tabs.create({ url: authUrl });
				});
			} catch (e) {
				// Fallback for browsers with no notifications support.
				tabs.create({ url: authUrl });
			}

			await this.updateAuthDisplayCount();
		}
	}

	/**
	 * Ask user for grant access for service covered by given scrobbler.
	 *
	 * @param {Object} scrobbler Scrobbler instance
	 */
	async authenticateScrobbler(scrobbler) {
		try {
			const authUrl = await scrobbler.getAuthUrl();

			ScrobbleService.bindScrobbler(scrobbler);
			tabs.create({ url: authUrl });
		} catch (e) {
			console.log(`Unable to get auth URL for ${scrobbler.getLabel()}`);

			Notifications.showSignInError(scrobbler, () => {
				const statusUrl = scrobbler.getStatusUrl();
				if (statusUrl) {
					tabs.create({ url: statusUrl });
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
	 * Called when a controller generates a new event.
	 *
	 * @param {Object} ctrl  Controller instance
	 * @param {Number} event Event generated by the controller
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
