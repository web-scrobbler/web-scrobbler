import { browser, Manifest, Notifications } from 'webextension-polyfill-ts';

import { BaseScrobbler } from '@/background/scrobbler/base-scrobbler';
import { Song } from '@/background/object/song';

import {
	getOption,
	USE_NOTIFICATIONS,
	USE_UNRECOGNIZED_SONG_NOTIFICATIONS,
} from '@/background/storage/options';
import { getPlatformName, isFullscreenMode } from '@/common/util-browser';
import { L } from '@/common/i18n';

type OnClickedListener = (notificationId: string) => void;

const manifest = browser.runtime.getManifest() as Manifest.WebExtensionManifest;

const defaultNotificationType: Notifications.TemplateType = 'basic';
const defaultIconUrl = browser.runtime.getURL(manifest.icons['128']);
const defaultTrackArtUrl = browser.runtime.getURL(
	'/icons/cover_art_default.png'
);
const unknownTrackArtUrl = browser.runtime.getURL(
	'/icons/cover_art_unknown.png'
);

/**
 * Now playing notification delay in milliseconds.
 */
const NOW_PLAYING_NOTIFICATION_DELAY = 5000;

/**
 * Map of click listeners indexed by notification IDs.
 */
const clickListeners: Record<string, OnClickedListener> = {};

let notificationTimeoutId: NodeJS.Timeout = null;

/**
 * Show 'Now playing' notification.
 *
 * @param song Copy of song instance
 * @param contextMessage Context message
 * @param [onClick] Function that will be called on notification click
 */
export function showNowPlaying(
	song: Song,
	contextMessage: string,
	onClick: OnClickedListener
): void {
	if (!isAllowed()) {
		return;
	}

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

	const userPlayCount = song.metadata.userPlayCount;
	if (userPlayCount) {
		const userPlayCountStr = L`infoYourScrobbles ${userPlayCount.toString()}`;

		message = `${message}\n${userPlayCountStr}`;
	}

	const options: Notifications.CreateNotificationOptions = {
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

	clearNotificationTimeout();

	notificationTimeoutId = setTimeout(() => {
		showNotification(options, onClick)
			.then((notificationId) => {
				song.metadata.notificationId = notificationId;
			})
			.catch((err: Error) => {
				console.warn(
					`Unable to show now playing notification: ${err.message}`
				);
			});
	}, NOW_PLAYING_NOTIFICATION_DELAY);
}

/**
 * Remove now playing notification for given song.
 *
 * @param song Song instance
 */
export function clearNowPlaying(song: Song): void {
	clearNotificationTimeout();
	remove(song.metadata.notificationId);
}

/**
 * Show an error notification if a user is unable to sign in to service.
 *
 * @param scrobbler Scrobbler instance
 * @param [onClick] Function that will be called on notification click
 */
export function showSignInError(
	scrobbler: BaseScrobbler,
	onClick: OnClickedListener
): void {
	const errorMessage = L`notificationUnableSignIn ${scrobbler.getLabel()}`;

	showErrorNotification(errorMessage, onClick);
}

/**
 * Show a notification if a given song is not recognized.
 *
 * @param song Song instance
 * @param [onClick] Function that will be called on notification click
 */
export async function showSongNotRecognized(
	song: Song,
	onClick: OnClickedListener
): Promise<void> {
	if (!getOption(USE_UNRECOGNIZED_SONG_NOTIFICATIONS)) {
		return;
	}

	const options = {
		type: defaultNotificationType,
		iconUrl: unknownTrackArtUrl,
		title: L`notificationNotRecognized`,
		message: L`notificationNotRecognizedText`,
	};

	const notificationId = await showNotification(options, onClick);
	song.metadata.notificationId = notificationId;
}

/**
 * Show an auth notification.
 *
 * @param onClicked Function that will be called on notification click
 */
export async function showAuthNotification(
	onClicked: OnClickedListener
): Promise<void> {
	const options = {
		type: defaultNotificationType,
		title: L`notificationConnectAccounts`,
		message: L`notificationConnectAccountsText`,
	};

	await showNotification(options, onClicked);
}

/**
 * Check if browser notifications are available.
 *
 * Note that Chrome on Mac does not show notification while in fullscreen mode.
 *
 * @return Check result
 */
async function isAvailable(): Promise<boolean> {
	/* @ifdef CHROME */
	const platform = await getPlatformName();
	if (platform === 'mac') {
		return !(await isFullscreenMode());
	}

	return true;
	/* @endif */
	/* @ifdef FIREFOX **
	return true;
	/* @endif */
}

/**
 * Check if browser notifications are allowed by user.
 *
 * @return Check result
 */
function isAllowed(): boolean {
	return getOption(USE_NOTIFICATIONS);
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
function addOnClickedListener(
	notificationId: string,
	callback: OnClickedListener
) {
	clickListeners[notificationId] = callback;
}

/**
 * Remove the onClicked listener for given notification.
 *
 * @param notificationId Notification ID
 */
function removeOnClickedListener(notificationId: string): void {
	if (clickListeners[notificationId]) {
		delete clickListeners[notificationId];
	}
}

/**
 * Show a notification.
 *
 * @param options Notification options
 * @param [onClick] Function that will be called on notification click
 *
 * @return Notification ID
 */
async function showNotification(
	options: Notifications.CreateNotificationOptions,
	onClick: OnClickedListener
): Promise<string> {
	if (!(await isAvailable())) {
		throw new Error('Notifications are not available');
	}

	const notificationOptions: Notifications.CreateNotificationOptions = {
		...options,
	};

	if (onClick) {
		notificationOptions.isClickable = true;
	}

	let notificationId: string = null;
	try {
		notificationId = await browser.notifications.create(
			'',
			notificationOptions
		);
	} catch (err) {
		// Use the default track art and try again
		if (options.iconUrl === defaultTrackArtUrl) {
			throw err;
		}

		options.iconUrl = defaultTrackArtUrl;
		notificationId = await browser.notifications.create(
			'',
			notificationOptions
		);
	}

	if (onClick) {
		addOnClickedListener(notificationId, onClick);
	}

	return notificationId;
}

/**
 * Show error notification.
 *
 * @param message Notification message
 * @param [onClick] Function that will be called on notification click
 */
function showErrorNotification(
	message: string,
	onClick: OnClickedListener = null
): void {
	const title = L`notificationAuthError`;
	const options = {
		type: defaultNotificationType,
		iconUrl: defaultIconUrl,
		title,
		message,
	};

	showNotification(options, onClick);
}

/**
 * Completely remove notification.
 *
 * Do nothing if ID does not match any existing notification.
 *
 * @param notificationId Notification ID
 */
function remove(notificationId: string): void {
	if (notificationId) {
		browser.notifications.clear(notificationId);
	}
}

function clearNotificationTimeout(): void {
	if (notificationTimeoutId) {
		clearTimeout(notificationTimeoutId);
		notificationTimeoutId = null;
	}
}

browser.notifications.onClicked.addListener((notificationId) => {
	console.log(`Notification onClicked: ${notificationId}`);

	if (clickListeners[notificationId]) {
		clickListeners[notificationId](notificationId);
	}
});
browser.notifications.onClosed.addListener((notificationId) => {
	removeOnClickedListener(notificationId);
});
