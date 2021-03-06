import { browser } from 'webextension-polyfill-ts';

import { ControllerMode } from '@/background/object/controller-mode';

import { L } from '@/common/i18n';
import { Song } from '@/background/model/song/Song';
import { LoveStatus } from '@/background/model/song/LoveStatus';
import { DelayedAction } from '@/background/util/DelayedAction';

import type { ActionIcon } from '@/ui/action-icon/ActionIcon';

/**
 * A wrapper around the browser.browserAction API.
 */
export class BrowserActionIcon implements ActionIcon {
	private currentBrowserAction: BrowserActionItem = null;
	private previousBrowserAction: BrowserActionItem = null;
	private tempIconAction = new DelayedAction(tempIconDisplayDuration);

	setAction(song: Song, mode: ControllerMode): void {
		const browserActionItem = ControllerActions[mode];
		const placeholder = song && song.getArtistTrackString();

		this.setPermBrowserAction(browserActionItem, placeholder);
	}

	setLoveStatus(song: Song, loveStatus: LoveStatus): void {
		const mode =
			loveStatus === LoveStatus.Loved
				? ExtensionActions.Loved
				: ExtensionActions.Unloved;
		this.setTempBrowserAction(mode, song.getArtistTrackString());
	}

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

		if (this.tempIconAction.isPending()) {
			// Override last mode, but don't change the browser action
			this.previousBrowserAction = browserAction;
		} else {
			this.currentBrowserAction = browserAction;
			this.setBrowserAction(browserAction);
		}
	}

	/**
	 * Set browser action icon temporarily. After `tempIconDisplayDuration` ms
	 * restore previous non-temporary browser action icon.
	 *
	 * @param mode Browser action mode
	 * @param placeholder String used to format title
	 */
	private setTempBrowserAction(
		mode: BrowserActionRawItem,
		placeholder: string
	): void {
		if (this.tempIconAction.isPending()) {
			this.tempIconAction.cancel();
		} else {
			this.previousBrowserAction = this.currentBrowserAction;
		}

		const browserActionItem = this.getBrowserActionItemFromRawItem(
			mode,
			placeholder
		);
		this.setBrowserAction(browserActionItem);
		this.tempIconAction.execute(() => {
			this.setBrowserAction(this.previousBrowserAction);
		});
	}

	private getBrowserActionItemFromRawItem(
		rawItem: BrowserActionRawItem,
		placeholder: string
	): BrowserActionItem {
		const { icon, popupName, titleId } = rawItem;
		const title = L(titleId, placeholder);
		const path = {
			19: `/icons/page-action-${icon}-19.png`,
			38: `/icons/page-action-${icon}-38.png`,
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
		} catch {
			console.warn('Unable to set browser action icon');
		}
	}
}

const tempIconDisplayDuration = 5000;

interface BrowserActionItem {
	readonly path: Record<string, string>;
	readonly popup: string;
	readonly title: string;
}

/**
 * A basic type of an object containing browser action info.
 */
interface BrowserActionRawItem {
	/**
	 * A browser action icon name.
	 *
	 * This value will be converted to '/icons/page_action-${icon}-${size}.png'.
	 */
	readonly icon: string;

	/**
	 * A popup name. Can be nullable, if you don't need a popup for the
	 * browser action.
	 *
	 * This value will be converted to a path to the popup HTML file.
	 */
	readonly popupName: string | null;

	/**
	 * An i18n ID of the browser action title.
	 */
	readonly titleId: string;
}

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
