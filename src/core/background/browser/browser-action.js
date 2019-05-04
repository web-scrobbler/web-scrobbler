'use strict';

define((require) => {
	const browser = require('webextension-polyfill');

	const State = {
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
		}

		/**
		 * Set icon, title and popup in single call.
		 * @param {Object} state Browser action state
		 * @param {String} placeholder String used to format title
		 */
		async setBrowserAction(state, placeholder) {
			let tabId = this.tabId;

			let { icon, popup, i18n } = state;
			let title = browser.i18n.getMessage(i18n, placeholder);
			let path = {
				19: `/icons/page_action_${icon}_19.png`,
				38: `/icons/page_action_${icon}_38.png`
			};

			try {
				await browser.browserAction.setIcon({ tabId, path });
				await browser.browserAction.setTitle({ tabId, title });
				await browser.browserAction.setPopup({ tabId, popup });
			} catch (e) {
				console.warn(
					`Unable to set browser action icon for tab ${tabId}`);
			}
		}

		/**
		 * Show read Last.fm icon (connector is injected).
		 */
		setSiteSupported() {
			this.setBrowserAction(State.base);
		}

		/**
		 * Show search icon (song is processing by pipeline).
		 * @param {Object} song Song instance
		 */
		setSongLoading(song) {
			this.setBrowserAction(State.loading, song.getArtistTrackString());
		}

		/**
		 * Show now playing icon.
		 * @param {Object} song Song instance
		 */
		setSongRecognized(song) {
			this.setBrowserAction(State.recognized, song.getArtistTrackString());
		}

		/**
		 * Show gray now playing icon (song is skipped by user).
		 * @param {Object} song Song instance
		 */
		setSongSkipped(song) {
			this.setBrowserAction(State.skipped, song.getArtistTrackString());
		}

		/**
		 * Show red cross icon (song is ignored by scrobbling service).
		 * @param {Object} song Song instance
		 */
		setSongIgnored(song) {
			this.setBrowserAction(State.ignored, song.getArtistTrackString());
		}

		/**
		 * Show gray Last.fm icon (connector is disabled).
		 */
		setSiteDisabled() {
			this.setBrowserAction(State.disabled);
		}

		/**
		 * Show green tick icon (song is scrobbled).
		 * @param {Object} song Song instance
		 */
		setSongScrobbled(song) {
			this.setBrowserAction(State.scrobbled, song.getArtistTrackString());
		}

		/**
		 * Show gray question icon (song is not known by scrobbling service).
		 */
		setSongNotRecognized() {
			this.setBrowserAction(State.unknown);
		}

		/**
		 * Show orange Last.fm icon (auth error is occurred).
		 */
		setError() {
			this.setBrowserAction(State.error);
		}

		/**
		 * Hide browser action icon.
		 */
		reset() {
			this.setBrowserAction(State.unsupported);
		}
	}

	return BrowserAction;
});
