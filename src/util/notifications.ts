import { BaseSong } from '@/core/object/song';

import browser from 'webextension-polyfill';
import { getPlatformName, isFullscreenMode } from '@/util/util-browser';
import * as Options from '@/core/storage/options';
import { ConnectorMeta } from '@/core/connectors';
import { Scrobbler } from '@/core/object/scrobble-service';
import { debugLog } from '@/core/content/util';

/**
 * Notification service.
 * Note: safari currently does not support the browser.notifications API.
 * As such, notification calls are optional chained, so nothing happens in safari.
 */

const manifest = browser.runtime.getManifest();
const DEFAULT_OPTIONS_VALUES: {
	type: 'basic';
	iconUrl: string;
} = {
	type: 'basic',
	iconUrl: browser.runtime.getURL(manifest.icons?.['128'] ?? ''),
};

const defaultTrackArtUrl = browser.runtime.getURL('/img/cover_art_default.png');
const unknownTrackArtUrl = browser.runtime.getURL('img/cover_art_unknown.png');

/**
 * Now playing notification delay in milliseconds.
 */
const NOW_PLAYING_NOTIFICATION_DELAY = 5000;

/**
 * Map of click listeners indexed by notification IDs.
 */
const clickListeners: { [key: string]: (notificationId: string) => void } = {};

let notificationTimeoutId: NodeJS.Timeout | null = null;

/**
 * Check if notifications are available.
 * Chrome on Mac does not show notification while in fullscreen mode.
 * @returns Check result
 */
async function isAvailable() {
	// #v-ifdef VITE_CHROME
	const platform = await getPlatformName();
	if (platform === 'mac') {
		return !(await isFullscreenMode());
	}

	return true;
	// #v-endif
	// #v-ifdef VITE_FIREFOX
	return true;
	// #v-endif
}

/**
 * Check if notifications are allowed by user.
 * @param connector - Connector instance
 * @returns Check result
 */
async function isAllowed(connector: ConnectorMeta) {
	return Options.getOption(Options.USE_NOTIFICATIONS, connector.id);
}

/**
 * Set up listener for click on given notification.
 * All clicks are handled internally and transparently passed to listeners, if any.
 * Setting multiple listeners for single notification is not supported,
 * the last set listener will overwrite any previous.
 *
 * @param notificationId - Notification ID
 * @param callback - Function that will be called on notification click
 */
function addOnClickedListener(notificationId: number, callback: () => void) {
	clickListeners[notificationId] = callback;
}

/**
 * Remove onClicked listener for given notification.
 * @param notificationId - Notification ID
 */
function removeOnClickedListener(notificationId: string) {
	if (clickListeners[notificationId]) {
		delete clickListeners[notificationId];
	}
}

interface BaseNotificationOptions {
	message: string;
	title: string;

	iconUrl?: string;
	contextMessage?: string;
	silent?: boolean;

	isClickable?: boolean;
}

interface ProcessedNotificationOptions extends BaseNotificationOptions {
	iconUrl: string;
	type: 'basic';
}

/**
 * Show notification.
 * @param options - Notification options
 * @param onClick - Function that will be called on notification click
 * @returns Notification ID
 */
async function showNotification(
	options: BaseNotificationOptions,
	onClick: (() => void) | null
) {
	if (!(await isAvailable())) {
		throw new Error('Notifications are not available');
	}

	if (typeof onClick === 'function') {
		options.isClickable = true;
	}

	const processedOptions: ProcessedNotificationOptions = {
		...DEFAULT_OPTIONS_VALUES,
		...options,
	};

	let notificationId: string;
	try {
		notificationId = await browser.notifications?.create(
			'',
			processedOptions
		);
	} catch (err) {
		// Use default track art and try again
		if (processedOptions.iconUrl === defaultTrackArtUrl) {
			throw err;
		}

		processedOptions.iconUrl = defaultTrackArtUrl;
		notificationId = await browser.notifications?.create(
			'',
			processedOptions
		);
	}

	if (typeof onClick === 'function') {
		addOnClickedListener(parseInt(notificationId), onClick);
	}

	return notificationId;
}

/**
 * Show 'Now playing' notification.
 * @param song - Copy of song instance
 * @param connector - Connector instance
 * @param onClick - Function that will be called on notification click
 */
export async function showNowPlaying(
	song: BaseSong,
	connector: ConnectorMeta,
	onClick: () => void
): Promise<void> {
	if (!(await isAllowed(connector))) {
		return;
	}

	const connectorLabel = song.metadata.label;
	const iconUrl = song.getTrackArt() || defaultTrackArtUrl;
	let message = song.getArtist();
	let title = song.getTrack();
	// #v-ifdef VITE_FIREFOX
	message = `${song.getTrack()}\n${song.getArtist()}`;
	title = `Web Scrobbler \u2022 ${connectorLabel}`;
	// #v-endif

	const albumName = song.getAlbum();
	if (albumName) {
		message = `${message ?? 'null'}\n${albumName}`;
	}

	const userPlayCount = song.metadata.userPlayCount;
	if (userPlayCount) {
		const userPlayCountStr = browser.i18n.getMessage(
			'infoYourScrobbles',
			userPlayCount.toString()
		);
		message = `${message ?? 'null'}\n${userPlayCountStr}`;
	}

	const options = {
		iconUrl,
		title: title ?? 'null',
		message: message ?? 'null',

		// #v-ifdef VITE_CHROME
		silent: true,
		contextMessage: connectorLabel,
		// #v-endif
	};

	clearNotificationTimeout();

	notificationTimeoutId = setTimeout(() => {
		showNotification(options, onClick)
			.then((notificationId) => {
				song.metadata.notificationId = notificationId;
			})
			.catch((err) => {
				debugLog('Unable to show now playing notification: ', 'warn');
				debugLog(err, 'warn');
			});
	}, NOW_PLAYING_NOTIFICATION_DELAY);
}

/**
 * Remove now playing notification for given song.
 * @param song - Song instance
 */
export function clearNowPlaying(song: BaseSong): void {
	if (!song.metadata.notificationId) {
		throw new Error('Notification ID is not set');
	}
	clearNotificationTimeout();
	remove(song.metadata.notificationId);
}

/**
 * Show error notification.
 * @param message - Notification message
 * @param onClick - Function that will be called on notification click
 */
export function showError(
	message: string,
	onClick: (() => void) | null = null
): void {
	const title = browser.i18n.getMessage('notificationAuthError');
	const options = { title, message };
	void showNotification(options, onClick);
}

/**
 * Show error notification if user is unable to sign in to service.
 * @param scrobbler - Scrobbler instance
 * @param onClick - Function that will be called on notification click
 */
export function showSignInError(
	scrobbler: Scrobbler,
	onClick: () => void
): void {
	const errorMessage = browser.i18n.getMessage(
		'notificationUnableSignIn',
		scrobbler.getLabel()
	);
	showError(errorMessage, onClick);
}

/**
 * Show notification if song is not recognized.
 * @param song - Song instance
 * @param connector - Connector instance
 * @param onClick - Function that will be called on notification click
 */
export async function showSongNotRecognized(
	song: BaseSong,
	connector: ConnectorMeta,
	onClick: () => void
): Promise<void> {
	if (
		!(await Options.getOption(
			Options.USE_UNRECOGNIZED_SONG_NOTIFICATIONS,
			connector.id
		))
	) {
		return;
	}

	const options = {
		iconUrl: unknownTrackArtUrl,
		title: browser.i18n.getMessage('notificationNotRecognized'),
		message: browser.i18n.getMessage('notificationNotRecognizedText'),
	};

	const notificationId = await showNotification(options, onClick);
	song.metadata.notificationId = notificationId;
}

/**
 * Show auth notification.
 * @param onClick - Function that will be called on notification click
 */
export async function showAuthNotification(onClick: () => void): Promise<void> {
	const options = {
		title: browser.i18n.getMessage('notificationConnectAccounts'),
		message: browser.i18n.getMessage('notificationConnectAccountsText'),
	};

	await showNotification(options, onClick);
}

/**
 * Completely remove notification.
 * Do nothing if ID does not match any existing notification.
 *
 * @param notificationId - Notification ID
 */
function remove(notificationId: string) {
	if (notificationId) {
		void browser.notifications?.clear(notificationId);
	}
}

function clearNotificationTimeout() {
	if (notificationTimeoutId) {
		clearTimeout(notificationTimeoutId);
		notificationTimeoutId = null;
	}
}

browser.notifications?.onClicked.addListener((notificationId) => {
	debugLog(`Notification onClicked: ${notificationId}`);

	if (clickListeners[notificationId]) {
		clickListeners[notificationId](notificationId);
	}
});
browser.notifications?.onClosed.addListener((notificationId) => {
	removeOnClickedListener(notificationId);
});
