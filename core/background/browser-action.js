'use strict';

define(() => {
	const state = {
		base: {
			icon: 'base',
			popup: '/popups/go_play_music.html',
			i18n: 'pageActionBase',
		},
		loading: {
			icon: 'loading',
			popup: '',
			i18n: 'pageActionLoading',
		},
		recognized: {
			icon: 'note',
			popup: '/popups/info.html',
			i18n: 'pageActionRecognized',
		},
		scrobbled: {
			icon: 'tick',
			popup: '/popups/info.html',
			i18n: 'pageActionScrobbled',
		},
		skipped: {
			icon: 'skipped',
			popup: '/popups/info.html',
			i18n: 'pageActionSkipped',
		},
		ignored: {
			icon: 'ignored',
			popup: '',
			i18n: 'pageActionIgnored',
		},
		disabled: {
			icon: 'disabled',
			popup: '/popups/disabled.html',
			i18n: 'pageActionDisabled',
		},
		unknown: {
			icon: 'unknown',
			popup: '/popups/info.html',
			i18n: 'pageActionUnknown',
		},
		error: {
			icon: 'error',
			popup: '/popups/error.html',
			i18n: 'pageActionError',
		},
		unsupported: {
			icon: 'unsupported',
			popup: '/popups/unsupported.html',
			i18n: 'pageActionUnsupported',
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
					let { icon, popup, i18n } = state;
					let title = chrome.i18n.getMessage(i18n, placeholder);
					let path = {
						19: `/icons/page_action_${icon}_19.png`,
						38: `/icons/page_action_${icon}_38.png`
					};

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

		/**
		 * Hide browser action icon.
		 */
		reset() {
			this.setBrowserAction(state.unsupported);
		}
	}

	return BrowserAction;
});
