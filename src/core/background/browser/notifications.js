'use strict';

define((require) => {
	const { i18n, notifications, runtime } = require('webextension-polyfill');
	const { getPlatformName, isFullscreenMode } = require('util/util-browser');
	const Options = require('storage/options');

	const manifest = runtime.getManifest();
	const DEFAULT_OPTIONS_VALUES = {
		type: 'basic',
		iconUrl: runtime.getURL(manifest.icons['128']),
	};

	const defaultTrackArtUrl = runtime.getURL('/icons/cover_art_default.png');
	const unknownTrackArtUrl = runtime.getURL('icons/cover_art_unknown.png');

	/**
	 * Now playing notification delay in milliseconds.
	 */
	const NOW_PLAYING_NOTIFICATION_DELAY = 5000;

	/**
	 * Map of click listeners indexed by notification IDs.
	 * @type {Object}
	 */
	const clickListeners = {};

	let notificationTimeoutId = null;

	/**
	 * Check if notifications are available.
	 * Chrome on Mac does not show notification while in fullscreen mode.
	 * @return {Boolean} Check result
	 */
	async function isAvailable() {
		// @ifdef CHROME
		const platform = await getPlatformName();
		if (platform === 'mac') {
			return !await isFullscreenMode();
		}

		return true;
		// @endif
		/* @ifdef FIREFOX
		return true;
		/* @endif */
	}

	/**
	 * Check if notifications are allowed by user.
	 * @return {Boolean} Check result
	 */
	function isAllowed() {
		return Options.getOption(Options.USE_NOTIFICATIONS);
	}

	/**
	 * Set up listener for click on given notification.
	 * All clicks are handled internally and transparently passed to listeners, if any.
	 * Setting multiple listeners for single notification is not supported,
	 * the last set listener will overwrite any previous.
	 *
	 * @param {String} notificationId Notification ID
	 * @param {Function} callback Function that will be called on notification click
	 */
	function addOnClickedListener(notificationId, callback) {
		clickListeners[notificationId] = callback;
	}

	/**
	 * Remove onClicked listener for given notification.
	 * @param {String} notificationId Notification ID
	 */
	function removeOnClickedListener(notificationId) {
		if (clickListeners[notificationId]) {
			delete clickListeners[notificationId];
		}
	}

	/**
	 * Show notification.
	 * @param  {Object} options Notification options
	 * @param  {Function} [onClick] Function that will be called on notification click
	 * @return {String} Notification ID
	 */
	async function showNotification(options, onClick) {
		if (!await isAvailable()) {
			throw new Error('Notifications are not available');
		}

		if (typeof onClicked === 'function') {
			options.isClickable = true;
		}

		for (const key in DEFAULT_OPTIONS_VALUES) {
			if (options[key]) {
				continue;
			}

			const defaultValue = DEFAULT_OPTIONS_VALUES[key];
			options[key] = defaultValue;
		}

		let notificationId;
		try {
			notificationId = await notifications.create('', options);
		} catch (err) {
			// Use default track art and try again
			if (options.iconUrl === defaultTrackArtUrl) {
				throw err;
			}

			options.iconUrl = defaultTrackArtUrl;
			notificationId = await notifications.create('', options);
		}

		if (typeof onClick === 'function') {
			addOnClickedListener(notificationId, onClick);
		}

		return notificationId;
	}

	/**
	 * Show 'Now playing' notification.
	 * @param  {Object} song Copy of song instance
	 * @param  {String} contextMessage Context message
	 * @param  {Function} [onClick] Function that will be called on notification click
	 */
	function showNowPlaying(song, contextMessage, onClick) {
		if (!isAllowed()) {
			return;
		}

		const iconUrl = song.getTrackArt() || defaultTrackArtUrl;
		// @ifdef CHROME
		let message = song.getArtist();
		const title = song.getTrack();
		// @endif
		/* @ifdef FIREFOX
		let message = `${song.getTrack()}\n${song.getArtist()}`;
		let title = `Web Scrobbler \u2022 ${contextMessage}`;
		/* @endif */

		const albumName = song.getAlbum();
		if (albumName) {
			message = `${message}\n${albumName}`;
		}

		const userPlayCount = song.metadata.userPlayCount;
		if (userPlayCount) {
			const userPlayCountStr = i18n.getMessage('infoYourScrobbles', [userPlayCount]);
			message = `${message}\n${userPlayCountStr}`;
		}

		const options = {
			iconUrl, title, message,

			// @ifdef CHROME
			silent: true,
			contextMessage,
			// @endif
		};

		clearNotificationTimeout();

		notificationTimeoutId = setTimeout(async () => {
			try {
				const notificationId = await showNotification(options, onClick);
				song.metadata.notificationId = notificationId;
			} catch (err) {
				console.warn(`Unable to show now playing notification: ${err.message}`);
			}
		}, NOW_PLAYING_NOTIFICATION_DELAY);
	}

	/**
	 * Remove now playing notification for given song.
	 * @param  {Object} song Song instance
	 */
	function clearNowPlaying(song) {
		clearNotificationTimeout();
		remove(song.metadata.notificationId);
	}

	/**
	 * Show error notification.
	 * @param  {String} message Notification message
	 * @param  {Function} [onClick] Function that will be called on notification click
	 */
	function showError(message, onClick = null) {
		const title = i18n.getMessage('notificationAuthError');
		const options = { title, message };
		showNotification(options, onClick);
	}

	/**
	 * Show error notification if user is unable to sign in to service.
	 * @param  {Object} scrobbler Scrobbler instance
	 * @param  {Function} [onClick] Function that will be called on notification click
	 */
	function showSignInError(scrobbler, onClick) {
		const errorMessage = i18n('notificationUnableSignIn', scrobbler.label);
		showError(errorMessage, onClick);
	}

	/**
	 * Show notification if song is not recognized.
	 * @param  {Object} song Song instance
	 * @param  {Function} [onClick] Function that will be called on notification click
	 */
	async function showSongNotRecognized(song, onClick) {
		if (!Options.getOption(Options.USE_UNRECOGNIZED_SONG_NOTIFICATIONS)) {
			return;
		}

		const options = {
			iconUrl: unknownTrackArtUrl,
			title: i18n.getMessage('notificationNotRecognized'),
			message: i18n.getMessage('notificationNotRecognizedText'),
		};

		const notificationId = await showNotification(options, onClick);
		song.metadata.notificationId = notificationId;
	}

	/**
	 * Show auth notification.
	 * @param  {Function} onClicked Function that will be called on notification click
	 */
	async function showAuthNotification(onClicked) {
		const options = {
			title: i18n.getMessage('notificationConnectAccounts'),
			message: i18n.getMessage('notificationConnectAccountsText'),
		};

		await showNotification(options, onClicked);
	}

	/**
	 * Completely remove notification.
	 * Do nothing if ID does not match any existing notification.
	 *
	 * @param  {String} notificationId Notification ID
	 */
	function remove(notificationId) {
		if (notificationId) {
			notifications.clear(notificationId);
		}
	}

	function clearNotificationTimeout() {
		if (notificationTimeoutId) {
			clearTimeout(notificationTimeoutId);
			notificationTimeoutId = null;
		}
	}

	notifications.onClicked.addListener((notificationId) => {
		console.log(`Notification onClicked: ${notificationId}`);

		if (clickListeners[notificationId]) {
			clickListeners[notificationId](notificationId);
		}
	});
	notifications.onClosed.addListener((notificationId) => {
		removeOnClickedListener(notificationId);
	});

	return {
		clearNowPlaying,
		showAuthNotification,
		showError,
		showNowPlaying,
		showSignInError,
		showSongNotRecognized,
	};
});
