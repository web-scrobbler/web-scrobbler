import {
	browser,
	Notifications as BNotifications,
} from 'webextension-polyfill-ts';

import {
	Notifications,
	OnClickedListener,
} from '@/background/browser/notifications/Notifications';

import { Song } from '@/background/model/song/Song';
import { L } from '@/common/i18n';

export class BrowserNotifications implements Notifications {
	/**
	 * Map of click listeners indexed by notification IDs.
	 */
	private clickListeners: Record<string, OnClickedListener> = {};
	private notificationTimeoutId: NodeJS.Timeout = null;

	constructor() {
		browser.notifications.onClicked.addListener((notificationId) => {
			this.executeOnClickedListener(notificationId);
		});

		browser.notifications.onClosed.addListener((notificationId) => {
			this.removeOnClickedListener(notificationId);
		});
	}

	areAvailable(): Promise<boolean> {
		return Promise.resolve(true);
	}

	async showNowPlayingNotification(
		song: Song,
		contextMessage: string,
		onClick: OnClickedListener
	): Promise<void> {
		const iconUrl = song.getTrackArt() || defaultTrackArtUrl;
		/* @ifdef CHROME */
		let message = song.getArtist();
		const title = song.getTrack();
		/* @endif */
		/* @ifdef FIREFOX **
		let message = `${song.getTrack()}\n${song.getArtist()}`;
		let title = `Web Scrobbler \u2022 ${contextMessage}`;
		/* @endif */

		const albumName = song.getAlbum();
		if (albumName) {
			message = `${message}\n${albumName}`;
		}

		const userPlayCount = song.getMetadata('userPlayCount');
		if (userPlayCount) {
			const userPlayCountStr = L`infoYourScrobbles ${userPlayCount.toString()}`;

			message = `${message}\n${userPlayCountStr}`;
		}

		const options: BNotifications.CreateNotificationOptions = {
			type: defaultNotificationType,
			iconUrl,
			title,
			message,
		};

		/* @ifdef CHROME */
		// Setup Chrome-related properties separately
		// (Workaround for bypass `preprocess` module error)

		// @ts-ignore It's not available in WebExtension API
		options.silent = true;
		options.contextMessage = contextMessage;
		/* @endif */

		this.clearNotificationTimeout();

		return new Promise((resolve, reject) => {
			this.notificationTimeoutId = setTimeout(() => {
				this.showNotification(options, onClick)
					.then((notificationId) => {
						song.setMetadata('notificationId', notificationId);
						resolve();
					})
					.catch(reject);
			}, NOW_PLAYING_NOTIFICATION_DELAY);
		});
	}

	clearNowPlaying(song: Song): void {
		const notificationId = song.getMetadata('notificationId');
		this.removeNotification(notificationId);
	}

	async showSongNotRecognized(
		song: Song,
		onClick: OnClickedListener
	): Promise<void> {
		const options = {
			type: defaultNotificationType,
			iconUrl: unknownTrackArtUrl,
			title: L`notificationNotRecognized`,
			message: L`notificationNotRecognizedText`,
		};

		const notificationId = await this.showNotification(options, onClick);
		song.setMetadata('notificationId', notificationId);
	}

	async showAuthNotification(onClicked: OnClickedListener): Promise<void> {
		const options = {
			type: defaultNotificationType,
			title: L`notificationConnectAccounts`,
			message: L`notificationConnectAccountsText`,
		};

		await this.showNotification(options, onClicked);
	}

	private async showNotification(
		options: BNotifications.CreateNotificationOptions,
		onClick: OnClickedListener
	): Promise<string> {
		const notificationOptions: BNotifications.CreateNotificationOptions = {
			...options,
		};

		if (onClick) {
			notificationOptions.isClickable = true;
		}

		const notificationId = await browser.notifications.create(
			'',
			notificationOptions
		);

		if (onClick) {
			this.addOnClickedListener(notificationId, onClick);
		}

		return notificationId;
	}

	private removeNotification(notificationId: string): void {
		if (!notificationId) {
			return;
		}

		browser.notifications.clear(notificationId);
	}

	/**
	 * Set up listener for click on given notification.
	 *
	 * All clicks are handled internally and transparently passed to listeners.
	 * Setting multiple listeners for a single notification is not supported,
	 * the last set listener will overwrite any previous.
	 *
	 * @param notificationId Notification ID
	 * @param callback Function that will be called on notification click
	 */
	private addOnClickedListener(
		notificationId: string,
		callback: OnClickedListener
	): void {
		this.clickListeners[notificationId] = callback;
	}

	private executeOnClickedListener(notificationId: string): void {
		if (this.clickListeners[notificationId]) {
			this.clickListeners[notificationId](notificationId);
		}
	}

	/**
	 * Remove the onClicked listener for given notification.
	 *
	 * @param notificationId Notification ID
	 */
	private removeOnClickedListener(notificationId: string): void {
		if (notificationId in this.clickListeners) {
			delete this.clickListeners[notificationId];
		}
	}

	private clearNotificationTimeout(): void {
		if (this.notificationTimeoutId) {
			clearTimeout(this.notificationTimeoutId);

			this.notificationTimeoutId = null;
		}
	}
}

const defaultNotificationType: BNotifications.TemplateType = 'basic';
const defaultTrackArtUrl = browser.runtime.getURL(
	'/icons/cover-art-default.png'
);
const unknownTrackArtUrl = browser.runtime.getURL(
	'/icons/cover-art-unknown.png'
);

/**
 * Now playing notification delay in milliseconds.
 */
const NOW_PLAYING_NOTIFICATION_DELAY = 5000;
