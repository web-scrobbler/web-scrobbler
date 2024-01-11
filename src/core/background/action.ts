import browser from 'webextension-polyfill';
import {
	contextMenus,
	getBrowserPreferredTheme,
	getChannelDetails,
	getChannelBlocklistLabel,
} from './util';
import { sendPopupMessage } from '@/util/communication';
import { ManagerTab } from '@/core/storage/wrapper';
import * as ControllerMode from '@/core/object/controller/controller-mode';
import { getConnectorByUrl } from '@/util/util-connector';
import { t } from '@/util/i18n';
import ClonedSong from '@/core/object/cloned-song';

/**
 * Updates action state using information from a tab
 *
 * @param tab - The tab to get new action state from
 */
export async function performUpdateAction(tab: ManagerTab) {
	sendPopupMessage({
		type: 'currentTab',
		payload: tab,
	}).catch((err) => {
		console.warn(err);
	});

	await updateMenus(tab);
	setAction(tab);
}

/**
 * Updates which context menu items are displayed.
 *
 * @param tab - tab to base update of context menus on
 */
async function updateMenus(tab: ManagerTab): Promise<void> {
	if (tab.mode === ControllerMode.Unsupported) {
		browser.contextMenus?.update(contextMenus.ENABLE_CONNECTOR, {
			visible: false,
		});
		browser.contextMenus?.update(contextMenus.DISABLE_CONNECTOR, {
			visible: false,
		});
		browser.contextMenus?.update(contextMenus.DISABLE_UNTIL_CLOSED, {
			visible: false,
		});
		browser.contextMenus?.update(contextMenus.DISABLE_CHANNEL, {
			visible: false,
		});
		browser.contextMenus?.update(contextMenus.ENABLE_CHANNEL, {
			visible: false,
		});
		return;
	}

	const tabData = await browser.tabs.get(tab.tabId);
	const connector = await getConnectorByUrl(tabData.url ?? '');
	if (tab.mode === ControllerMode.Disabled) {
		browser.contextMenus?.update(contextMenus.ENABLE_CONNECTOR, {
			visible: true,
			title: t('menuEnableConnector', connector?.label),
		});
		browser.contextMenus?.update(contextMenus.DISABLE_CONNECTOR, {
			visible: false,
		});
		browser.contextMenus?.update(contextMenus.DISABLE_UNTIL_CLOSED, {
			visible: false,
		});
		browser.contextMenus?.update(contextMenus.DISABLE_CHANNEL, {
			visible: false,
		});
		browser.contextMenus?.update(contextMenus.ENABLE_CHANNEL, {
			visible: false,
		});
		return;
	}

	browser.contextMenus?.update(contextMenus.ENABLE_CONNECTOR, {
		visible: false,
	});
	browser.contextMenus?.update(contextMenus.DISABLE_CONNECTOR, {
		visible: true,
		title: t('menuDisableConnector', connector?.label),
	});
	browser.contextMenus?.update(contextMenus.DISABLE_UNTIL_CLOSED, {
		visible: true,
		title: t('menuDisableUntilTabClosed', connector?.label),
	});

	const channelDetails = await getChannelDetails(tab.tabId);
	if (
		!channelDetails ||
		!channelDetails.channelInfo?.id ||
		!channelDetails.connector
	) {
		browser.contextMenus?.update(contextMenus.DISABLE_CHANNEL, {
			visible: false,
		});
		browser.contextMenus?.update(contextMenus.ENABLE_CHANNEL, {
			visible: false,
		});
	} else if (
		await getChannelBlocklistLabel(
			channelDetails.channelInfo.id,
			channelDetails.connector,
		)
	) {
		browser.contextMenus?.update(contextMenus.DISABLE_CHANNEL, {
			visible: false,
		});
		browser.contextMenus?.update(contextMenus.ENABLE_CHANNEL, {
			visible: true,
			title: t('menuEnableChannel', channelDetails.channelInfo.label),
		});
	} else {
		browser.contextMenus?.update(contextMenus.DISABLE_CHANNEL, {
			visible: true,
			title: t('menuDisableChannel', channelDetails.channelInfo.label),
		});
		browser.contextMenus?.update(contextMenus.ENABLE_CHANNEL, {
			visible: false,
		});
	}
}

/**
 * Browser behavior on what URLs are accepted for files is inconsistent.
 * This function detects what browser is used and fetches the right URL.
 *
 * @param url - absolute URL of icon
 * @returns icon URL that's usable in the current browser
 */
function getIconURL(url: string) {
	const runtimeURL = browser.runtime.getURL(url);
	if (runtimeURL.startsWith('safari')) {
		return url;
	}
	return runtimeURL;
}

/**
 * Set action details
 *
 * @param mode - Controller mode to set state to display
 * @param song - Currently playing song, if there is one
 */
async function setAction(tab: ManagerTab): Promise<void> {
	let songstr = '';
	if (tab.song) {
		const clonedSong = new ClonedSong(tab.song, -1);
		songstr = `${clonedSong.getArtist()} - ${clonedSong.getTrack()}`;
	}

	const iconType = await getIconType();
	const iconPath = (resolution: number) =>
		`icons/action_${tab.mode.toLowerCase()}_${resolution}_${iconType}.png`;

	browser.action.setIcon({
		path: {
			16: getIconURL(iconPath(16)),
			19: getIconURL(iconPath(19)),
			32: getIconURL(iconPath(32)),
			38: getIconURL(iconPath(38)),
		},
	});
	browser.action.setTitle({
		title: t(`pageAction${tab.mode}`, songstr),
	});
}

/**
 * Gets appropriate icon type.
 * Safari has entirely separate icons, and chromium/firefox uses themed icons.
 * Get the type of icon to display
 *
 * @returns the icon type to display.
 */
async function getIconType() {
	if (!browser.notifications) {
		return 'safari';
	}

	return getBrowserPreferredTheme();
}
