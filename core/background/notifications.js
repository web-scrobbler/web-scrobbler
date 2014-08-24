'use strict';

define([
	'wrappers/chrome'
], function(chrome) {

	/**
	 * Map of click listeners indexed by notification IDs
	 * @type {{}}
	 */
	var clickListeners = {};

	/**
	 * Dummy callback
	 */
	var emptyCB = function() {};

	/**
	 * Checks for permissions and existence of Notifications API
	 * (to be safe to run on minor browsers like Opera)
	 */
	function isAvailable() {
		return chrome.notifications !== undefined;
	}

	/**
	 * Checks for user configuration
	 */
	function isAllowed() {
		return localStorage.useNotifications == 1;
	}

	/**
	 * Sets up listener for click on given notification.
	 * All clicks are handled internally and transparently passed to listeners, if any.
	 * Setting multiple listeners for single notification is not supported,
	 * the last set listener will overwrite any previous.
	 *
	 * @param notificationId
	 * @param callback - notification ID will be passed as a single parameter
	 */
	function addOnClickedListener(notificationId, callback) {
		clickListeners[notificationId] = callback;
	}



	function showPlaying(song) {
		if (!isAvailable() || !isAllowed()) {
			return;
		}

		var createNotification = function(permissionLevel) {
			if (permissionLevel === 'granted') {

				var options = {
					type: 'basic',
					iconUrl: 'icon128.png',
					title: song.track,
					message: 'by ' + song.artist
				};

				chrome.notifications.create('', options, emptyCB);
			}
		};

		chrome.notifications.getPermissionLevel(createNotification);
	}


	function showError(message) {
		if (!isAvailable() || !isAllowed()) {
			return;
		}

		var createNotification = function(permissionLevel) {
			if (permissionLevel === 'granted') {

				var options = {
					type: 'basic',
					iconUrl: 'icon128.png',
					title: 'Web scrobbler error',
					message: message
				};

				chrome.notifications.create('', options, emptyCB);
			}
		};

		chrome.notifications.getPermissionLevel(createNotification);
	}


	function showAuthenticate(authUrl) {
		if (!isAvailable()) {
			// fallback for browsers with no notifications support
			window.open(authUrl, 'scrobbler-auth');
			return;
		}

		var notificationCreatedCb = function(notificationId) {
			addOnClickedListener(notificationId, function() {
				window.open(authUrl, 'scrobbler-auth');
			});
		};

		var createNotification = function(permissionLevel) {
			if (permissionLevel === 'granted') {

				var options = {
					type: 'basic',
					iconUrl: 'icon128.png',
					title: 'Connect your Last.FM account',
					message: 'Click the notification or connect later in the extension options page',
					isClickable: true
				};

				chrome.notifications.create('', options, notificationCreatedCb);
			}
		};

		chrome.notifications.getPermissionLevel(createNotification);
	}


	// set up listening for clicks on all notifications
	chrome.notifications.onClicked.addListener(function(notificationId) {
		console.log('Notification onClicked: ' + notificationId);

		if (clickListeners[notificationId]) {
			clickListeners[notificationId](notificationId);
		}
	});


	return {
		showPlaying: showPlaying,
		showError: showError,
		showAuthenticate: showAuthenticate
	};

});
