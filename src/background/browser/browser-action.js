import { browserAction } from 'webextension-polyfill';

import * as ControllerMode from '@/background/object/controller-mode';
import { L } from '@/common/i18n';

const TEMP_ICON_DISPLAY_DURATION = 5000;

const Mode = {
	[ControllerMode.Base]: {
		icon: 'base',
		popup: '/ui/popups/go-play-music.html',
		titleId: 'pageActionBase',
	},
	[ControllerMode.Loading]: {
		icon: 'loading',
		popup: '',
		titleId: 'pageActionLoading',
	},
	[ControllerMode.Playing]: {
		icon: 'note',
		popup: '/ui/popups/info.html',
		titleId: 'pageActionRecognized',
	},
	[ControllerMode.Scrobbled]: {
		icon: 'tick',
		popup: '/ui/popups/info.html',
		titleId: 'pageActionScrobbled',
	},
	[ControllerMode.Skipped]: {
		icon: 'skipped',
		popup: '/ui/popups/info.html',
		titleId: 'pageActionSkipped',
	},
	[ControllerMode.Ignored]: {
		icon: 'ignored',
		popup: '',
		titleId: 'pageActionIgnored',
	},
	[ControllerMode.Disabled]: {
		icon: 'disabled',
		popup: '/ui/popups/disabled.html',
		titleId: 'pageActionDisabled',
	},
	[ControllerMode.Unknown]: {
		icon: 'unknown',
		popup: '/ui/popups/info.html',
		titleId: 'pageActionUnknown',
	},
	[ControllerMode.Err]: {
		icon: 'error',
		popup: '/ui/popups/error.html',
		titleId: 'pageActionError',
	},

	Loved: {
		icon: 'loved',
		popup: '/ui/popups/info.html',
		titleId: 'pageActionLoved',
	},
	Unloved: {
		icon: 'unloved',
		popup: '/ui/popups/info.html',
		titleId: 'pageActionUnloved',
	},
	Unsupported: {
		icon: 'unsupported',
		popup: '/ui/popups/unsupported.html',
		titleId: 'pageActionUnsupported',
	},
};

/**
 * Object for access to browser action of a single controller (tab).
 */
export default class BrowserAction {
	/**
	 * @constructor
	 */
	constructor() {
		this.currBrowserAction = {};
		this.lastBrowserAction = {};
		this.timeoutId = null;
	}

	update(ctrl) {
		const baMode = Mode[ctrl.mode];
		let placeholder = null;

		const currentSong = ctrl.getCurrentSong();
		if (currentSong) {
			placeholder = currentSong.getArtistTrackString();
		}

		this.setPermBrowserAction(baMode, placeholder);
	}

	setSongLoved(isLoved, song) {
		const mode = isLoved ? Mode.Loved : Mode.Unloved;
		this.setTempBrowserAction(mode, song.getArtistTrackString());
	}

	/**
	 * Reset browser action icon.
	 */
	reset() {
		this.setPermBrowserAction(Mode.Unsupported);
	}

	/* Internal functions */

	setPermBrowserAction(mode, placeholder) {
		const browserAction = this.getBrowserAction(mode, placeholder);

		if (this.isTempIconVisible()) {
			// Override last mode, but don't change the browser action
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
	 * @param {Object} mode Browser action mode
	 * @param {String} placeholder String used to format title
	 */
	setTempBrowserAction(mode, placeholder) {
		if (this.isTempIconVisible()) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		} else {
			this.lastBrowserAction = this.currBrowserAction;
		}

		const browserAction = this.getBrowserAction(mode, placeholder);
		this.setRawBrowserAction(browserAction);
		this.timeoutId = setTimeout(() => {
			this.timeoutId = null;

			this.setRawBrowserAction(this.lastBrowserAction);
		}, TEMP_ICON_DISPLAY_DURATION);
	}

	getBrowserAction(mode, placeholder) {
		const { icon, popup, titleId } = mode;
		const title = L(titleId, placeholder);
		const path = {
			19: `/icons/page_action_${icon}_19.png`,
			38: `/icons/page_action_${icon}_38.png`,
		};

		return { path, title, popup };
	}

	async setRawBrowserAction(browserActionData) {
		const { path, title, popup } = browserActionData;

		try {
			await browserAction.setIcon({ path });
			await browserAction.setTitle({ title });
			await browserAction.setPopup({ popup });
		} catch (e) {
			console.warn('Unable to set browser action icon');
		}
	}

	isTempIconVisible() {
		return this.timeoutId !== null;
	}
}
