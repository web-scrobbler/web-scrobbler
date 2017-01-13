'use strict';

define([
	'wrappers/chrome',
	'services/background-ga'
], function(chrome, GA) {

	/**
	 * Map of click listeners indexed by notification IDs.
	 * @type {Object}
	 */
	var clickListeners = {};

	/**
	 * Check for permissions and existence of Notifications API
	 * (to be safe to run on minor browsers like Opera).
	 */
	function isAvailable() {
		return chrome.notifications !== undefined;
	}

	/**
	 * Check if notifications are allowed by user.
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
	 * Show 'Now playing' notification.
	 * @param  {Object} song Copy of song instance
	 */
	function showPlaying(song) {
		if (!isAvailable() || !isAllowed()) {
			return;
		}

		var notificationCreatedCb = function(notificationId) {
			GA.event('notification', 'playing', 'show');
			song.metadata.attr('notificationId', notificationId);
		};

		var createNotification = function(permissionLevel) {
			if (permissionLevel === 'granted') {
				var hhMM = function(date) {
					date = date ? date : new Date();
					var hours = date.getHours();
					var minutes = date.getMinutes();
					var ampm = hours >= 12 ? 'pm' : 'am';
					hours = hours % 12;
					hours = hours ? hours : 12; // the hour '0' should be '12'
					minutes = minutes < 10 ? '0' + minutes : minutes;
					var strTime = hours + ':' + minutes + ampm;
					return strTime;
				};

				var connector = song.metadata.connector ? ' · ' + song.metadata.connector.label : '';
				var options = {
					type: 'basic',
					iconUrl: song.getTrackArt() || 'default_cover_art.png',
					title: song.getTrack(),
					message: 'by ' + song.getArtist(),
					contextMessage: hhMM() + connector
				};

				try {
					chrome.notifications.create('', options, notificationCreatedCb);
				} catch (e) {
					console.log('Failed to create a notification.', e);
				}
			}
		};

		chrome.notifications.getPermissionLevel(createNotification);
	}

	/**
	 * Show error notificiation.
	 * @param  {String} message Notification message
	 */
	function showError(message) {
		if (!isAvailable() || !isAllowed()) {
			return;
		}

		var notificationCreatedCb = function() {
			GA.event('notification', 'error', 'show');
		};

		var createNotification = function(permissionLevel) {
			if (permissionLevel === 'granted') {

				var options = {
					type: 'basic',
					iconUrl: '/icon128.png',
					title: 'Web scrobbler error',
					message: message
				};

				chrome.notifications.create('', options, notificationCreatedCb);
			}
		};

		chrome.notifications.getPermissionLevel(createNotification);
	}

	/**
	 * Show auth notification.
	 *
	 * @param {Promise} authUrlGetter Promise that will resolve with auth URL
	 */
	function showAuthenticate(authUrlGetter) {
		var onHaveAuthUrl = function(authUrl) {
			if (!isAvailable()) {
				GA.event('notification', 'authenticate', 'open-unavailable');

				// fallback for browsers with no notifications support
				window.open(authUrl, 'scrobbler-auth');
				return;
			}

			var notificationCreatedCb = function(notificationId) {
				addOnClickedListener(notificationId, function() {
					GA.event('notification', 'authenticate', 'click');

					window.open(authUrl, 'scrobbler-auth');
				});

				GA.event('notification', 'authenticate', 'show');
			};

			var createNotification = function(permissionLevel) {
				if (permissionLevel === 'granted') {

					var options = {
						type: 'basic',
						iconUrl: '/icon128.png',
						title: 'Connect your Last.FM account',
						message: 'Click the notification or connect later in the extension options page',
						isClickable: true
					};

					chrome.notifications.create('', options, notificationCreatedCb);
				}
			};

			chrome.notifications.getPermissionLevel(createNotification);
		};

		authUrlGetter().then(onHaveAuthUrl).catch(() => {
			showError('Unable to log in to Last.fm. Please try later');
		});
	}

	/**
	 * Completely remove notification.
	 * Do nothing if ID does not match any existing notification.
	 *
	 * @param  {String} notificationId Notification ID
	 */
	function remove(notificationId) {
		var onCleared = function() {
			// nop
		};

		if (notificationId) {
			chrome.notifications.clear(notificationId, onCleared);
		}
	}

	// Set up listening for clicks on all notifications
	chrome.notifications.onClicked.addListener(function(notificationId) {
		console.log('Notification onClicked: ' + notificationId);

		if (clickListeners[notificationId]) {
			clickListeners[notificationId](notificationId);
		}
	});

	return {
		showPlaying: showPlaying,
		showError: showError,
		showAuthenticate: showAuthenticate,
		remove: remove
	};

});
