'use strict';

define([], () => {
	const ICONS = {
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
		SKIPPED: {
			'19': '/icons/page_action_skipped.svg',
			'38': '/icons/page_action_skipped.svg'
		},
		IGNORED: {
			'19': '/icons/page_action_ignored.svg',
			'38': '/icons/page_action_ignored.svg'
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

	const DOCUMENTS = {
		BASE: '/popups/go_play_music.html',
		SONG_INFO: '/popups/info.html',
		ERROR_INFO: '/popups/error.html'
	};

	/**
	 * Object for access to page action of a single controller (tab).
	 */
	class PageAction {
		/**
		 * @constructor
   	 	 * @param {Number} tabId Tab ID
		 */
		constructor(tabId) {
			this.tabId = tabId;
		}

		/**
		 * Set icon, title and popup in single call.
		 * @param {String} path Path to page action icon
		 * @param {String} title Page action title
		 * @param {String} popup Path to popup document
		 */
		setPageAction(path, title, popup = '') {
			let tabId = this.tabId;
			chrome.tabs.get(tabId, () => {
				if (chrome.runtime.lastError) {
					// tab doesn't exist
					console.info(`While executing this.setPageAction: ${
						chrome.runtime.lastError.message}`);
				} else {
					// tab exists
					chrome.pageAction.hide(tabId);
					chrome.pageAction.setIcon({ tabId, path });
					chrome.pageAction.setTitle({ tabId, title });
					chrome.pageAction.setPopup({ tabId, popup });
					chrome.pageAction.show(tabId);
				}
			});
		}

		setSiteSupported() {
			this.setPageAction(ICONS.BASE,
				'This site is supported for scrobbling',
				DOCUMENTS.BASE);
		}

		/**
		 * @param {Object} song Song instance
		 */
		setSongLoading(song) {
			this.setPageAction(
				ICONS.LOADING, `Looking up ${song.getArtistTrackString()}`
			);
		}

		setSongRecognized(song) {
			this.setPageAction(ICONS.RECOGNIZED,
				`Now playing ${song.getArtistTrackString()}`,
				DOCUMENTS.SONG_INFO);
		}

		setSongSkipped(song) {
			this.setPageAction(ICONS.SKIPPED,
				`Skipped ${song.getArtistTrackString()}`,
				DOCUMENTS.SONG_INFO);
		}

		setSongIgnored(song) {
			this.setPageAction(
				ICONS.IGNORED, `Ignored ${song.getArtistTrackString()}`
			);
		}

		setSiteDisabled() {
			this.setPageAction(
				ICONS.DISABLED,	'This site is supported, but you disabled it'
			);
		}

		setSongScrobbled(song) {
			this.setPageAction(ICONS.SCROBBLED,
				`Scrobbled ${song.getArtistTrackString()}`,
				DOCUMENTS.SONG_INFO);
		}

		setSongNotRecognized() {
			this.setPageAction(ICONS.UNKNOWN,
				'The song was not recognized. Click to enter correct info',
				DOCUMENTS.SONG_INFO);
		}

		setError() {
			this.setPageAction(ICONS.ERROR,
				'Some service error was occurred. Click for more information.',
				DOCUMENTS.ERROR_INFO);
		}
	}

	return PageAction;
});
