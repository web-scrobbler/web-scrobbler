'use strict';

define((require) => {
	const Util = require('util');
	const chrome = require('wrapper/chrome');
	const ChromeStorage = require('storage/chrome-storage');

	// The module uses `chrome.extension.getURL` function.
	// This function is deprecated since Chrome 58.
	// FIXME: Replace to `chrome.runtime.getURL`.

	const options = ChromeStorage.getStorage(ChromeStorage.OPTIONS);

	const DEFAULT_OPTIONS_VALUES = {
		type: 'basic',
		iconUrl: chrome.extension.getURL('/icons/icon128.png'),
	};

	// @ifdef DEBUG
	/*
	 * Function stub for Firefox.
	 * Should be removed when this function will be implemented in Firefox.
	 * http://arewewebextensionsyet.com/
	 */
	if (chrome.notifications.getPermissionLevel === undefined) {
		chrome.notifications.getPermissionLevel = function(callback) {
			callback('granted');
		};
	}
	// @endif

	/**
	 * Map of click listeners indexed by notification IDs.
	 * @type {Object}
	 */
	const clickListeners = {};

	/**
	 * Check for permissions and existence of Notifications API
	 * (to be safe to run on minor browsers like Opera).
	 * @return {Boolean} Check result
	 */
	async function isAvailable() {
		if (chrome.notifications !== undefined) {
			// @ifdef CHROME
			// Chrome for MacOS doesn't show notifications in
			// fullscreen mode.
			let platform = await Util.getPlatformName();
			if (platform === 'mac') {
				let isFullscreen = await Util.isFullscreenMode();

				return !isFullscreen;
			}

			return true;
			// @endif
			/* @ifdef FIREFOX
			return true;
			/* @endif */
		}

		return false;
	}

	/**
	 * Check if notifications are allowed by user.
	 * @return {Boolean} Check result
	 */
	async function isAllowed() {
		let data = await options.get();
		return data.useNotifications;
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

		return new Promise((resolve, reject) => {
			const notificationCreatedCb = (notificationId) => {
				if (typeof onClicked === 'function') {
					addOnClickedListener(notificationId, onClicked);
				}
				resolve(notificationId);
			};
			// @ifndef FIREFOX
			function createNotification(permissionLevel) {
				if (permissionLevel !== 'granted') {
					reject();
					return;
				}
				// @endif
				try {
					chrome.notifications.create('', options, notificationCreatedCb);
				} catch (e) {
					reject(e);
				}
			// @ifndef FIREFOX
			}

			chrome.notifications.getPermissionLevel(createNotification);
			// @endif
		});
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

		let connectorLabel = song.metadata.connector.label;

		let options = {
			iconUrl: song.getTrackArt() || chrome.extension.getURL('/icons/default_cover_art.png'),
			// @ifdef CHROME
			title: song.getTrack(),
			silent: true,
			message: song.getArtist(),
			contextMessage: connectorLabel
			// @endif
			/* @ifdef FIREFOX
			title: 'Web Scrobbler',
			message: `${song.getTrack()}\n${song.getArtist()}\n${connectorLabel}`
			/* @endif */
		};
		let notificationId = await showNotification(options, onClick);
		song.metadata.notificationId = notificationId;
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
		let data = await options.get();
		if (!data.useUnrecognizedSongNotifications) {
			return;
		}

		let options = {
			iconUrl: chrome.extension.getURL('icons/question.png'),
			title: i18n('notificationNotRecognized'),
			message: i18n('notificationNotRecognizedText')
		};
		showNotification(options, onClicked);
	}

	/**
	 * Show auth notification.
	 * @param  {Function} onClicked Function that will be called on notification click
	 * @return {Promise} Promise resolved when the task has complete
	 */
	function showAuthNotification(onClicked) {
		const options = {
			title: i18n('notificationConnectAccounts'),
			message: i18n('notificationConnectAccountsText'),
		};

		return showNotification(options, onClicked);
	}

	/**
	 * Completely remove notification.
	 * Do nothing if ID does not match any existing notification.
	 *
	 * @param  {String} notificationId Notification ID
	 */
	function remove(notificationId) {
		if (notificationId) {
			chrome.notifications.clear(notificationId);
		}
	}

	function i18n(tag, ...context) {
		return chrome.i18n.getMessage(tag, context);
	}

	// Set up listening for clicks on all notifications
	chrome.notifications.onClicked.addListener(function(notificationId) {
		console.log(`Notification onClicked: ${notificationId}`);

		if (clickListeners[notificationId]) {
			clickListeners[notificationId](notificationId);
		}
	});
	chrome.notifications.onClosed.addListener((notificationId) => {
		removeOnClickedListener(notificationId);
	});

	return {
		remove, showNowPlaying, showError, showSignInError,
		showAuthNotification, showSongNotRecognized
	};
});
