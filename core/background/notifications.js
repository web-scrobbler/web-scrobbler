'use strict';

define([
	'util',
	'wrappers/chrome',
	'storage/chromeStorage',
	'services/background-ga'
], function(Util, chrome, ChromeStorage) {
	// The module uses `chrome.extension.getURL` function.
	// This funciton is deprecated since Chrome 58.
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
	 * @return {Promise} Promise that will be resolved with check result
	 */
	function isAvailable() {
		if (chrome.notifications !== undefined) {
			// @ifdef CHROME
			// Chrome for MacOS doesn't show notifications in
			// fullscreen mode.
			return Util.getPlatformName().then((platform) => {
				if (platform === 'mac') {
					return Util.isFullscreenMode().then((isFullscreen) => {
						return !isFullscreen;
					});
				}

				return true;
			});
			// @endif
			/* @ifdef FIREFOX
			return Promise.resolve(true);
			/* @endif */
		}

		return Promise.resolve(false);
	}

	/**
	 * Check if notifications are allowed by user.
	 * @return {Promise} Promise that will be resolved with check result
	 */
	function isAllowed() {
		return options.get().then((data) => {
			return data.useNotifications;
		});
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
	 * @return {Promise} Promise that will be resolved with notification ID
	 */
	function showNotification(options, onClicked) {
		return isAvailable().then((isAvailable) => {
			if (!isAvailable) {
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
					if (onClicked) {
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
		});
	}

	/**
	 * Show 'Now playing' notification.
	 * @param  {Object} song Copy of song instance
	 */
	function showPlaying(song) {
		isAllowed().then((flag) => {
			if (!flag) {
				return;
			}

			let connectorLabel = song.metadata.connector.label;

			let options = {
				iconUrl: song.getTrackArt() || chrome.extension.getURL('/icons/default_cover_art.png'),
				// @ifdef CHROME
				title: song.getTrack(),
				message: `by ${song.getArtist()}`,
				contextMessage: connectorLabel
				// @endif
				/* @ifdef FIREFOX
				title: 'Last.fm Scrobbler',
				message: `${song.getTrack()}\nby ${song.getArtist()}\n${connectorLabel}`
				/* @endif */
			};
			showNotification(options, null).then((notificationId) => {
				song.metadata.attr('notificationId', notificationId);
			});
		});
	}

	/**
	 * Show error notificiation.
	 * @param  {String} message Notification message
	 * @param  {Function} onClick Function that will be called on notification click
	 */
	function showError(message, onClick = null) {
		const options = { title: 'Authentication error', message };
		showNotification(options, onClick);
	}

	/**
	 * Show error notification if user is unable to sign in to service.
	 * @param  {Object} scrobbler Scrobbler instance
	 * @param  {Function} onClicked Function that will be called on notification click
	 */
	function showSignInError(scrobbler, onClicked) {
		let errorMessage = `Unable to sign in to ${scrobbler.getLabel()}. Please try later.`;
		showError(errorMessage, onClicked);
	}

	/**
	 * Show notification if song is not recognized.
	 */
	function showSongNotRecognized() {
		options.get().then((data) => {
			if (!data.useUnrecognizedSongNotifications) {
				return;
			}

			let options = {
				iconUrl: chrome.extension.getURL('icons/question.png'),
				title: 'The song is not recognized',
				message: 'Click on the icon in the extensions bar to correct and submit song info'
			};
			showNotification(options);
		});
	}

	/**
	 * Show auth notification.
	 * @param  {Function} onClicked Function that will be called on notification click
	 * @return {Promise} Promise resolved when the task has complete
	 */
	function showAuthNotification(onClicked) {
		const options = {
			title: 'Connect your accounts',
			message: 'Click the notification to connect your accounts',
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
		remove, showPlaying, showError, showSignInError,
		showAuthNotification, showSongNotRecognized
	};
});
