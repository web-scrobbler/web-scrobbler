import { browser } from 'webextension-polyfill-ts';

import Controller from '@/background/object/controller';
import Song from '@/background/object/song';

import { ControllerMode } from '@/background/object/controller-mode';
import { L } from '@/common/i18n';

const tempIconDisplayDuration = 5000;

/**
 * A basic type of an object containing browser action info.
 */
type BrowserActionRawItem = {
	/**
	 * A browser action icon name.
	 *
	 * This value will be converted to '/icons/page_action_${icon}_${size}.png'.
	 */
	icon: string;
	/**
	 * A popup name. Can be nullable, if you don't need a popup for the
	 * browser action.
	 *
	 * This value will be converted to '${popup}'.
	 */
	popupName: string | null;
	/**
	 * An i18n ID of the browser action title.
	 */
	titleId: string;
};

type BrowserActionItem = {
	path: Record<string, string>;
	popup: string;
	title: string;
};

const ControllerActions: Record<ControllerMode, BrowserActionRawItem> = {
	[ControllerMode.Base]: {
		icon: 'base',
		popupName: 'go-play-music',
		titleId: 'pageActionBase',
	},
	[ControllerMode.Loading]: {
		icon: 'loading',
		popupName: '',
		titleId: 'pageActionLoading',
	},
	[ControllerMode.Playing]: {
		icon: 'note',
		popupName: 'info',
		titleId: 'pageActionRecognized',
	},
	[ControllerMode.Scrobbled]: {
		icon: 'tick',
		popupName: 'info',
		titleId: 'pageActionScrobbled',
	},
	[ControllerMode.Skipped]: {
		icon: 'skipped',
		popupName: 'info',
		titleId: 'pageActionSkipped',
	},
	[ControllerMode.Ignored]: {
		icon: 'ignored',
		popupName: '',
		titleId: 'pageActionIgnored',
	},
	[ControllerMode.Disabled]: {
		icon: 'disabled',
		popupName: 'disabled',
		titleId: 'pageActionDisabled',
	},
	[ControllerMode.Unknown]: {
		icon: 'unknown',
		popupName: 'info',
		titleId: 'pageActionUnknown',
	},
	[ControllerMode.Err]: {
		icon: 'error',
		popupName: 'error',
		titleId: 'pageActionError',
	},
};

const ExtensionActions: Record<string, BrowserActionRawItem> = {
	Loved: {
		icon: 'loved',
		popupName: 'info',
		titleId: 'pageActionLoved',
	},
	Unloved: {
		icon: 'unloved',
		popupName: 'info',
		titleId: 'pageActionUnloved',
	},
	Unsupported: {
		icon: 'unsupported',
		popupName: 'unsupported',
		titleId: 'pageActionUnsupported',
	},
};

/**
 * A wrapper around the browser.browserAction API.
 */
export default class BrowserAction {
	currentBrowserAction: BrowserActionItem = null;
	previousBrowserAction: BrowserActionItem = null;
	timeoutId: NodeJS.Timeout = null;

	/**
	 * Update the browser action using a given controller as the context.
	 *
	 * @param controller Controller instance
	 */
	update(controller: Controller): void {
		const currentSong = controller.getCurrentSong();

		const browserActionItem = ControllerActions[controller.getMode()];
		const placeholder = currentSong && currentSong.getArtistTrackString();

		this.setPermBrowserAction(browserActionItem, placeholder);
	}

	/**
	 * Set a temporary love/unlove browser action.
	 *
	 * @param isLoved Is song loved or unloved
	 * @param song Song instance
	 */
	setSongLoved(isLoved: boolean, song: Song): void {
		const mode = isLoved
			? ExtensionActions.Loved
			: ExtensionActions.Unloved;
		this.setTempBrowserAction(mode, song.getArtistTrackString());
	}

	/**
	 * Set the browser action to the 'unsupported' action.
	 */
	reset(): void {
		this.setPermBrowserAction(ExtensionActions.Unsupported);
	}

	private setPermBrowserAction(
		browserActionItem: BrowserActionRawItem,
		placeholder?: string
	): void {
		const browserAction = this.getBrowserActionItemFromRawItem(
			browserActionItem,
			placeholder
		);

		if (this.isTempIconVisible()) {
			// Override last mode, but don't change the browser action
			this.previousBrowserAction = browserAction;
		} else {
			this.setBrowserAction(browserAction);
			this.currentBrowserAction = browserAction;
		}
	}

	/**
	 * Set browser action icon temporarily. After TEMP_ICON_DISPLAY_DURATION ms
	 * restore previous non-temporary browser action icon.
	 *
	 * @param mode Browser action mode
	 * @param placeholder String used to format title
	 */
	private setTempBrowserAction(
		mode: BrowserActionRawItem,
		placeholder: string
	): void {
		if (this.isTempIconVisible()) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		} else {
			this.previousBrowserAction = this.currentBrowserAction;
		}

		const browserActionItem = this.getBrowserActionItemFromRawItem(
			mode,
			placeholder
		);
		this.setBrowserAction(browserActionItem);
		this.timeoutId = setTimeout(() => {
			this.timeoutId = null;

			this.setBrowserAction(this.previousBrowserAction);
		}, tempIconDisplayDuration);
	}

	private getBrowserActionItemFromRawItem(
		rawItem: BrowserActionRawItem,
		placeholder: string
	): BrowserActionItem {
		const { icon, popupName, titleId } = rawItem;
		const title = L(titleId, placeholder);
		const path = {
			19: `/icons/page_action_${icon}_19.png`,
			38: `/icons/page_action_${icon}_38.png`,
		};
		const popup = popupName && `/ui/popups/${popupName}.html`;

		return { path, title, popup };
	}

	private async setBrowserAction(
		browserActionItem: BrowserActionItem
	): Promise<void> {
		const { path, title, popup } = browserActionItem;

		try {
			await browser.browserAction.setIcon({ path });
			await browser.browserAction.setTitle({ title });
			await browser.browserAction.setPopup({ popup });
		} catch (e) {
			console.warn('Unable to set browser action icon');
		}
	}

	isTempIconVisible(): boolean {
		return this.timeoutId !== null;
	}
}
