'use strict';

define((require) => {
	const browser = require('webextension-polyfill');
	const Util = require('util/util');
	const Options = require('storage/options');

	const manifest = chrome.runtime.getManifest();
	const DEFAULT_OPTIONS_VALUES = {
		type: 'basic',
		iconUrl: browser.runtime.getURL(manifest.icons['128']),
	};

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
		let platform = await Util.getPlatformName();
		if (platform === 'mac') {
			return !(await Util.isFullscreenMode());
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
	async function isAllowed() {
		return await Options.getOption(Options.USE_NOTIFICATIONS);
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
	 * @param  {Function} onClicked Function that will be called on notification click
	 * @return {String} Notification ID
	 */
	async function showNotification(options, onClicked) {
		if (!await isAvailable()) {
			throw new Error('Notifications are not available');
		}

		if (typeof onClicked === 'function') {
			options.isClickable = true;
		}

		for (let key in DEFAULT_OPTIONS_VALUES) {
			if (options[key]) {
				continue;
			}

			let defaultValue = DEFAULT_OPTIONS_VALUES[key];
			options[key] = defaultValue;
		}

		const notificationId = await browser.notifications.create('', options);
		if (typeof onClicked === 'function') {
			addOnClickedListener(notificationId, onClicked);
		}

		return notificationId;
	}

	/**
	 * Show 'Now playing' notification.
	 * @param  {Object} song Copy of song instance
	 * @param  {Function} onClick Function that will be called on notification click
	 */
	async function showNowPlaying(song, onClick) {
		if (!await isAllowed()) {
			return;
		}

		const connectorLabel = song.metadata.label;
		const iconUrl = song.getTrackArt() ||
			browser.runtime.getURL('/icons/cover_art_default.png');
		// @ifdef CHROME
		let message = song.getArtist();
		let title = song.getTrack();
		// @endif
		/* @ifdef FIREFOX
		let message = `${song.getTrack()}\n${song.getArtist()}`;
		let title = `Web Scrobbler \u2022 ${connectorLabel}`;
		/* @endif */

		const albumName = song.getAlbum();
		if (albumName) {
			message = `${message}\n${albumName}`;
		}

		const userPlayCount = song.metadata.userPlayCount;
		if (userPlayCount) {
			const userPlayCountStr = i18n('infoYourScrobbles', userPlayCount);
			message = `${message}\n${userPlayCountStr}`;
		}

		let options = {
			iconUrl, title, message,

			// @ifdef CHROME
			silent: true,
			contextMessage: connectorLabel
			// @endif
		};

		clearNotificationTimeout();

		notificationTimeoutId = setTimeout(async() => {
			const notificationId = await showNotification(options, onClick);
			song.metadata.notificationId = notificationId;
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
	 * @param  {Function} onClick Function that will be called on notification click
	 */
	function showError(message, onClick = null) {
		const options = { title: i18n('notificationAuthError'), message };
		showNotification(options, onClick);
	}

	/**
	 * Show error notification if user is unable to sign in to service.
	 * @param  {Object} scrobbler Scrobbler instance
	 * @param  {Function} onClicked Function that will be called on notification click
	 */
	function showSignInError(scrobbler, onClicked) {
		let errorMessage = i18n('notificationUnableSignIn', scrobbler.label);
		showError(errorMessage, onClicked);
	}

	/**
	 * Show notification if song is not recognized.
	 * @param  {Function} onClicked Function that will be called on notification click
	 */
	async function showSongNotRecognized(onClicked) {
		if (!(await Options.getOption(Options.USE_UNRECOGNIZED_SONG_NOTIFICATIONS))) {
			return;
		}

		let options = {
			iconUrl: browser.runtime.getURL('icons/cover_art_unknown.png'),
			title: i18n('notificationNotRecognized'),
			message: i18n('notificationNotRecognizedText')
		};
		showNotification(options, onClicked);
	}

	/**
	 * Show auth notification.
	 * @param  {Function} onClicked Function that will be called on notification click
	 */
	async function showAuthNotification(onClicked) {
		const options = {
			title: i18n('notificationConnectAccounts'),
			message: i18n('notificationConnectAccountsText'),
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
			browser.notifications.clear(notificationId);
		}
	}

	function i18n(tag, ...context) {
		return browser.i18n.getMessage(tag, context);
	}


	function clearNotificationTimeout() {
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

	return {
		clearNowPlaying, showNowPlaying, showError, showSignInError,
		showAuthNotification, showSongNotRecognized
	};
});
