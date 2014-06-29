'use strict';

define([
	'wrappers/chrome'
], function(chrome) {

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




	return {
		showPlaying: showPlaying,
		showError: showError
	};

});
