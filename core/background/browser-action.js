'use strict';

define(() => {
	const state = {
		base: {
			path: {
				'19': '/icons/page_action_base.svg',
				'38': '/icons/page_action_base.svg'
			},
			popup: '/popups/go_play_music.html',
			i18n: 'pageActionBase',
		},
		loading: {
			path: {
				'19': '/icons/page_action_loading.png',
				'38': '/icons/page_action_loading_38.png'
			},
			popup: '',
			i18n: 'pageActionLoading',
		},
		recognized: {
			path: {
				'19': '/icons/page_action_note.svg',
				'38': '/icons/page_action_note.svg'
			},
			popup: '/popups/info.html',
			i18n: 'pageActionRecognized',
		},
		scrobbled: {
			path: {
				'19': '/icons/page_action_tick.svg',
				'38': '/icons/page_action_tick.svg'
			},
			popup: '/popups/info.html',
			i18n: 'pageActionScrobbled',
		},
		skipped: {
			path: {
				'19': '/icons/page_action_skipped.svg',
				'38': '/icons/page_action_skipped.svg'
			},
			popup: '/popups/info.html',
			i18n: 'pageActionSkipped',
		},
		ignored: {
			path: {
				'19': '/icons/page_action_ignored.svg',
				'38': '/icons/page_action_ignored.svg'
			},
			popup: '',
			i18n: 'pageActionIgnored',
		},
		disabled: {
			path: {
				'19': '/icons/page_action_disabled.svg',
				'38': '/icons/page_action_disabled.svg'
			},
			popup: '/popups/disabled.html',
			i18n: 'pageActionDisabled',
		},
		unknown: {
			path: {
				'19': '/icons/page_action_question.svg',
				'38': '/icons/page_action_question.svg'
			},
			popup: '/popups/info.html',
			i18n: 'pageActionUnknown',
		},
		error: {
			path: {
				'19': '/icons/page_action_error.svg',
				'38': '/icons/page_action_error.svg'
			},
			popup: '/popups/error.html',
			i18n: 'pageActionError',
		},
	};

	/**
	 * Object for access to browser action of a single controller (tab).
	 */
	class BrowserAction {
		/**
		 * @constructor
		 * @param {Number} tabId Tab ID
		 */
		constructor(tabId) {
			this.tabId = tabId;
			/* @ifdef FIREFOX
			// Part of workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1406765
			// FIXME: Remove if this issue is resolved
			this.path = null;
			this.title = null;
			this.popup = null;
			/* @endif */
		}

		/**
		 * Set icon, title and popup in single call.
		 * @param {Object} state Browser action state
		 * @param {String} placeholder String used to format title
		 */
		setBrowserAction(state, placeholder) {
			let tabId = this.tabId;
			chrome.tabs.get(tabId, () => {
				if (!chrome.runtime.lastError) {
					let { path, popup, i18n } = state;
					let title = chrome.i18n.getMessage(i18n, placeholder);

					/* @ifdef FIREFOX
					// Part of workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1406765
					// FIXME: Remove if this issue is resolved
					this.path = path;
					this.title = title;
					this.popup = popup;
					/* @endif */

					chrome.browserAction.setIcon({ tabId, path });
					chrome.browserAction.setTitle({ tabId, title });
					chrome.browserAction.setPopup({ tabId, popup });
				}
			});
		}

		/* @ifdef FIREFOX
		// Part of workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1406765
		// FIXME: Remove if this issue is resolved
		update() {
			let tabId = this.tabId;

			if (this.path) {
				chrome.browserAction.setIcon({ tabId, path: this.path });
			}
			if (this.title) {
				chrome.browserAction.setTitle({ tabId, title: this.title });
			}
			if (this.popup) {
				chrome.browserAction.setPopup({ tabId, popup: this.popup });
			}
		}
		/* @endif */

		/**
		 * Show read Last.fm icon (connector is injected).
		 */
		setSiteSupported() {
			this.setBrowserAction(state.base);
		}

		/**
		 * Show search icon (song is processing by pipeline).
		 * @param {Object} song Song instance
		 */
		setSongLoading(song) {
			this.setBrowserAction(state.loading, song.getArtistTrackString());
		}

		/**
		 * Show now playing icon.
		 * @param {Object} song Song instance
		 */
		setSongRecognized(song) {
			this.setBrowserAction(state.recognized, song.getArtistTrackString());
		}

		/**
		 * Show gray now playing icon (song is skipped by user).
		 * @param {Object} song Song instance
		 */
		setSongSkipped(song) {
			this.setBrowserAction(state.skipped, song.getArtistTrackString());
		}

		/**
		 * Show red cross icon (song is ignored by scrobbling service).
		 * @param {Object} song Song instance
		 */
		setSongIgnored(song) {
			this.setBrowserAction(state.ignored, song.getArtistTrackString());
		}

		/**
		 * Show gray Last.fm icon (connector is disabled).
		 */
		setSiteDisabled() {
			this.setBrowserAction(state.disabled);
		}

		/**
		 * Show green tick icon (song is scrobbled).
		 * @param {Object} song Song instance
		 */
		setSongScrobbled(song) {
			this.setBrowserAction(state.scrobbled, song.getArtistTrackString());
		}

		/**
		 * Show gray question icon (song is not known by scrobbling service).
		 */
		setSongNotRecognized() {
			this.setBrowserAction(state.unknown);
		}

		/**
		 * Show orange Last.fm icon (auth error is occurred).
		 */
		setError() {
			this.setBrowserAction(state.error);
		}
	}

	return BrowserAction;
});
