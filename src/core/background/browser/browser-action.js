'use strict';

define((require) => {
	const TEMP_ICON_DISPLAY_DURATION = 5000;

	const browser = require('webextension-polyfill');

	const State = {
		base: {
			icon: 'base',
			popup: '/ui/popups/go_play_music.html',
			i18n: 'pageActionBase',
		},
		loading: {
			icon: 'loading',
			popup: '',
			i18n: 'pageActionLoading',
		},
		recognized: {
			icon: 'note',
			popup: '/ui/popups/info.html',
			i18n: 'pageActionRecognized',
		},
		scrobbled: {
			icon: 'tick',
			popup: '/ui/popups/info.html',
			i18n: 'pageActionScrobbled',
		},
		skipped: {
			icon: 'skipped',
			popup: '/ui/popups/info.html',
			i18n: 'pageActionSkipped',
		},
		ignored: {
			icon: 'ignored',
			popup: '',
			i18n: 'pageActionIgnored',
		},
		disabled: {
			icon: 'disabled',
			popup: '/ui/popups/disabled.html',
			i18n: 'pageActionDisabled',
		},
		unknown: {
			icon: 'unknown',
			popup: '/ui/popups/info.html',
			i18n: 'pageActionUnknown',
		},
		error: {
			icon: 'error',
			popup: '/ui/popups/error.html',
			i18n: 'pageActionError',
		},
		unsupported: {
			icon: 'unsupported',
			popup: '/ui/popups/unsupported.html',
			i18n: 'pageActionUnsupported',
		},
		loved: {
			icon: 'loved',
			popup: '/ui/popups/info.html',
			i18n: 'pageActionLoved',
		},
		unloved: {
			icon: 'unloved',
			popup: '/ui/popups/info.html',
			i18n: 'pageActionUnloved',
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

			this.currBrowserAction = {};
			this.lastBrowserAction = {};
			this.timeoutId = null;
		}

		/**
		 * Show read Last.fm icon (connector is injected).
		 */
		setSiteSupported() {
			this.setPermBrowserAction(State.base);
		}

		/**
		 * Show search icon (song is processing by pipeline).
		 * @param {Object} song Song instance
		 */
		setSongLoading(song) {
			this.setPermBrowserAction(State.loading, song.getArtistTrackString());
		}

		/**
		 * Show now playing icon.
		 * @param {Object} song Song instance
		 */
		setSongRecognized(song) {
			this.setPermBrowserAction(State.recognized, song.getArtistTrackString());
		}

		/**
		 * Show gray now playing icon (song is skipped by user).
		 * @param {Object} song Song instance
		 */
		setSongSkipped(song) {
			this.setPermBrowserAction(State.skipped, song.getArtistTrackString());
		}

		/**
		 * Show red cross icon (song is ignored by scrobbling service).
		 * @param {Object} song Song instance
		 */
		setSongIgnored(song) {
			this.setPermBrowserAction(State.ignored, song.getArtistTrackString());
		}

		/**
		 * Show gray Last.fm icon (connector is disabled).
		 */
		setSiteDisabled() {
			this.setPermBrowserAction(State.disabled);
		}

		/**
		 * Show green tick icon (song is scrobbled).
		 * @param {Object} song Song instance
		 */
		setSongScrobbled(song) {
			this.setPermBrowserAction(State.scrobbled, song.getArtistTrackString());
		}

		/**
		 * Show gray question icon (song is not known by scrobbling service).
		 */
		setSongNotRecognized() {
			this.setPermBrowserAction(State.unknown);
		}

		/**
		 * Show orange Last.fm icon (auth error is occurred).
		 */
		setError() {
			this.setPermBrowserAction(State.error);
		}

		setSongLoved(isLoved, song) {
			const state = isLoved ? State.loved : State.unloved;
			this.setTempBrowserAction(state, song.getArtistTrackString());
		}

		/**
		 * Hide browser action icon.
		 */
		reset() {
			this.setPermBrowserAction(State.unsupported);
		}

		/* Internal functions */

		async setPermBrowserAction(state, placeholder) {
			const browserAction = this.getBrowserAction(state, placeholder);

			if (this.isTempIconVisible()) {
				// Override last state, but don't change the browser action
				this.lastBrowserAction = browserAction;
			} else {
				this.setRawBrowserAction(browserAction);
				this.currBrowserAction = browserAction;
			}
		}

		/**
		 * Set browser action icon temporarily. After
		 * TEMP_ICON_DISPLAY_DURATION ms restore previous
		 * non-temporary browser action icon.
		 *
		 * @param {Object} state Browser action state
		 * @param {String} placeholder String used to format title
		 */
		async setTempBrowserAction(state, placeholder) {
			if (this.isTempIconVisible()) {
				clearTimeout(this.timeoutId);
				this.timeoutId = null;
			} else {
				this.lastBrowserAction = this.currBrowserAction;
			}

			const browserAction = this.getBrowserAction(state, placeholder);
			this.setRawBrowserAction(browserAction);
			this.timeoutId = setTimeout(() => {
				this.timeoutId = null;

				this.setRawBrowserAction(this.lastBrowserAction);
			}, TEMP_ICON_DISPLAY_DURATION);
		}

		getBrowserAction(state, placeholder) {
			const { icon, popup, i18n } = state;
			const title = browser.i18n.getMessage(i18n, placeholder);
			const path = {
				19: `/icons/page_action_${icon}_19.png`,
				38: `/icons/page_action_${icon}_38.png`
			};

			return { path, title, popup };
		}

		async setRawBrowserAction(browserAction) {
			const tabId = this.tabId;
			const { path, title, popup } = browserAction;

			try {
				await browser.browserAction.setIcon({ tabId, path });
				await browser.browserAction.setTitle({ tabId, title });
				await browser.browserAction.setPopup({ tabId, popup });
			} catch (e) {
				console.warn(
					`Unable to set browser action icon for tab ${tabId}`);
			}
		}

		isTempIconVisible() {
			return this.timeoutId !== null;
		}
	}

	return BrowserAction;
});
