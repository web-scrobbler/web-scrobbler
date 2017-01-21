'use strict';

define([], function() {
	/**
	 * Object for access to page action of a single controller (tab).
	 *
	 * @constructor
	 * @param {Number} tabId Tab ID
	 */
	return function(tabId) {

		var icons = {
			BASE: {
				'19': '/icons/page_action_base.svg',
				'38': '/icons/page_action_base.svg'
			},
			LOADING: {
				'19': '/icons/page_action_loading.png',
				'38': '/icons/page_action_loading_38.png'
			},
			RECOGNIZED: {
				'19': '/icons/page_action_note.svg',
				'38': '/icons/page_action_note.svg'
			},
			DISABLED: {
				'19': '/icons/page_action_disabled.svg',
				'38': '/icons/page_action_disabled.svg'
			},
			SCROBBLED: {
				'19': '/icons/page_action_tick.svg',
				'38': '/icons/page_action_tick.svg'
			},
			UNKNOWN: {
				'19': '/icons/page_action_question.svg',
				'38': '/icons/page_action_question.svg'
			},
			ERROR: {
				'19': '/icons/page_action_error.svg',
				'38': '/icons/page_action_error.svg'
			}
		};

		var documents = {
			BASE: '/popups/go_play_music.html',
			SONG_INFO: '/popups/info.html',
			ERROR_INFO: '/popups/error.html'
		};

		/**
		 * Set icon, title and popup in single call.
		 * @param {String} icon Path to page action icon
		 * @param {String} title Page action title
		 * @param {String} popup Path to popup document
		 */
		function setPageAction(icon, title, popup) {
			chrome.tabs.get(tabId, function() {
				if (chrome.runtime.lastError) {
					// tab doesn't exist
					console.info('While executing setPageAction: ' +
						chrome.runtime.lastError.message);
				} else {
					// tab exists
					chrome.pageAction.hide(tabId);
					chrome.pageAction.setIcon({
						tabId: tabId,
						path: icon
					});
					chrome.pageAction.setTitle({
						tabId: tabId,
						title: title
					});
					chrome.pageAction.setPopup({
						tabId: tabId,
						popup: popup
					});
					chrome.pageAction.show(tabId);
				}
			});
		}

		this.onClicked = function() {
			// console.log('Page action clicked in tab ' + tabId);
		};

		this.setSiteSupported = function() {
			setPageAction(icons.BASE,
				'This site is supported for scrobbling',
				documents.BASE);
		};

		/**
		 * @param {Object} song Song instance
		 */
		this.setSongLoading = function(song) {
			setPageAction(icons.LOADING,
				'Looking up ' + song.getArtist() + ' - ' + song.getTrack(),
				'');
		};

		this.setSongRecognized = function(song) {
			setPageAction(icons.RECOGNIZED,
				'Now playing ' + song.getArtist() + ' - ' + song.getTrack(),
				documents.SONG_INFO);
		};

		this.setWebsiteDisabled = function() {
			setPageAction(icons.DISABLED,
				'This site is supported, but you disabled it',
				'');
		};

		this.setSongScrobbled = function(song) {
			setPageAction(icons.SCROBBLED,
				'Scrobbled ' + song.getArtist() + ' - ' + song.getTrack(),
				documents.SONG_INFO);
		};

		this.setSongNotRecognized = function() {
			setPageAction(icons.UNKNOWN,
				'The song was not recognized. Click to enter correct info',
				documents.SONG_INFO);
		};

		this.setError = function() {
			setPageAction(icons.ERROR,
				'Some service error was occurred. Click for more information.',
				documents.ERROR_INFO);
		};
	};

});
