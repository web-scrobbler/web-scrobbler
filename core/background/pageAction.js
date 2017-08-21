'use strict';

define(() => {
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

		/**
		 * Show read Last.fm icon (connector is injected).
		 */
		setSiteSupported() {
			this.setPageAction(ICONS.BASE,
				'This site is supported for scrobbling',
				DOCUMENTS.BASE);
		}

		/**
		 * Show search icon (song is processing by pipeline).
		 * @param {Object} song Song instance
		 */
		setSongLoading(song) {
			this.setPageAction(
				ICONS.LOADING, `Looking up ${song.getArtistTrackString()}`
			);
		}

		/**
		 * Show now playing icon.
		 * @param {Object} song Song instance
		 */
		setSongRecognized(song) {
			this.setPageAction(ICONS.RECOGNIZED,
				`Now playing ${song.getArtistTrackString()}`,
				DOCUMENTS.SONG_INFO);
		}

		/**
		 * Show gray now playing icon (song is skipped by user).
		 * @param {Object} song Song instance
		 */
		setSongSkipped(song) {
			this.setPageAction(ICONS.SKIPPED,
				`Skipped ${song.getArtistTrackString()}`,
				DOCUMENTS.SONG_INFO);
		}

		/**
		 * Show red cross icon (song is ignored by scrobbling service).
		 * @param {Object} song Song instance
		 */
		setSongIgnored(song) {
			this.setPageAction(
				ICONS.IGNORED, `Ignored ${song.getArtistTrackString()}`
			);
		}

		/**
		 * Show gray Last.fm icon (connector is disabled).
		 */
		setSiteDisabled() {
			this.setPageAction(
				ICONS.DISABLED,	'This site is supported, but you disabled it'
			);
		}

		/**
		 * Show green tick icon (song is scrobbled).
		 * @param {Object} song Song instance
		 */
		setSongScrobbled(song) {
			this.setPageAction(ICONS.SCROBBLED,
				`Scrobbled ${song.getArtistTrackString()}`,
				DOCUMENTS.SONG_INFO);
		}

		/**
		 * Show gray question icon (song is not known by scrobbling service).
		 */
		setSongNotRecognized() {
			this.setPageAction(ICONS.UNKNOWN,
				'The song was not recognized. Click to enter correct info',
				DOCUMENTS.SONG_INFO);
		}

		/**
		 * Show orange Last.fm icon (auth error is occurred).
		 */
		setError() {
			this.setPageAction(ICONS.ERROR,
				'Some service error was occurred. Click for more information.',
				DOCUMENTS.ERROR_INFO);
		}
	}

	return PageAction;
});
