'use strict';

define([
	'util',
	'wrappers/chrome',
	'services/background-ga'
], function(Util, chrome, GA) {
	const SIGN_IN_ERROR_MESSAGE = 'Unable to log in to Last.fm. Please try later';

	const DEFAULT_OPTIONS_VALUES = {
		type: 'basic',
		iconUrl: '/icons/icon128.png',
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
	 * @return {Boolean} True if notifications are allowed by user
	 */
	function isAllowed() {
		return localStorage.useNotifications === '1';
	}

	/**
	 * Set up listener for click on given notification.
	 * All clicks are handled internally and transparently passed to listeners, if any.
	 * Setting multiple listeners for single notification is not supported,
	 * the last set listener will overwrite any previous.
	 *
	 * @param {String} notificationId Notification ID
	 * @param {function} callback Function that will be called on notification click
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
		if (!isAllowed()) {
			return;
		}

		let currentTime = Util.getCurrentTime();
		let connectorLabel = song.metadata.connector.label;
		let contextMessage = `${currentTime} · ${connectorLabel}`;

		let options = {
			iconUrl: song.getTrackArt() || '/icons/default_cover_art.png',
			// @ifdef CHROME
			title: song.getTrack(),
			message: 'by ' + song.getArtist(),
			contextMessage
			// @endif
			/* @ifdef FIREFOX
			title: 'Last.fm Scrobbler',
			message: `${song.getTrack()}\nby ${song.getArtist()}\n${contextMessage}`
			/* @endif */
		};
		showNotification(options, null).then((notificationId) => {
			GA.event('notification', 'playing', 'show');
			song.metadata.attr('notificationId', notificationId);
		}).catch(nop);
	}

	/**
	 * Show error notificiation.
	 * @param  {String} message Notification message
	 * @param  {Function} onClick Function that will be called on notification click
	 */
	function showError(message, onClick = null) {
		const options = {
			title: 'Last.fm Scrobbler error',
			message: message,
		};
		showNotification(options, onClick).then(() => {
			GA.event('notification', 'error', 'show');
		}).catch(nop);
	}

	/**
	 * Show error notification if user is unable to sign in to Last.fm.
	 */
	function showSignInError() {
		showError(SIGN_IN_ERROR_MESSAGE, () => {
			chrome.tabs.create({ url: 'http://status.last.fm/' });
		});
	}

	/**
	 * Show notification if song is not recognized.
	 */
	function showSongNotRecognized() {
		if (localStorage.useUnrecognizedSongNotifications !== '1') {
			return;
		}

		let options = {
			iconUrl: 'icons/question.png',
			title: 'The song is not recognized',
			message: 'Click on the icon in the extensions bar to correct and submit song info'
		};
		showNotification(options);
	}

	/**
	 * Show auth notification.
	 *
	 * @param {Promise} authUrlGetter Promise that will resolve with auth URL
	 */
	function showAuthenticate(authUrlGetter) {
		authUrlGetter().then((authUrl) => {
			const options = {
				title: 'Connect your Last.FM account',
				message: 'Click the notification or connect later in the extension options page',
			};
			function onClicked() {
				GA.event('notification', 'authenticate', 'click');

				chrome.tabs.create({ url: authUrl });
			}

			showNotification(options, onClicked).then(() => {
				GA.event('notification', 'authenticate', 'show');
			}).catch(() => {
				GA.event('notification', 'authenticate', 'open-unavailable');

				// fallback for browsers with no notifications support
				chrome.tabs.create({ url: authUrl });
			});
		}).catch(showSignInError);
	}

	/**
	 * Completely remove notification.
	 * Do nothing if ID does not match any existing notification.
	 *
	 * @param  {String} notificationId Notification ID
	 */
	function remove(notificationId) {
		if (notificationId) {
			chrome.notifications.clear(notificationId, nop);
		}
	}

	/**
	 * Do nothing. Used to suppress Promise errors.
	 */
	function nop() {
		// do nothing
	}

	// Set up listening for clicks on all notifications
	chrome.notifications.onClicked.addListener(function(notificationId) {
		console.log('Notification onClicked: ' + notificationId);

		if (clickListeners[notificationId]) {
			clickListeners[notificationId](notificationId);
		}
	});
	chrome.notifications.onClosed.addListener((notificationId) => {
		removeOnClickedListener(notificationId);
	});

	return {
		showPlaying: showPlaying,
		showError: showError,
		showSongNotRecognized: showSongNotRecognized,
		showAuthenticate: showAuthenticate,
		remove: remove
	};

});
