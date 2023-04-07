import browser from 'webextension-polyfill';
import { contextMenus, getCurrentTab } from './util';
import { sendBackgroundMessage, sendPopupMessage } from '@/util/communication';
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
 * Fetches the tab to update action state from, and then updates the action state
 */
export async function updateAction() {
	const tab = await getCurrentTab();
	await performUpdateAction(tab);
}

/**
 * Updates which context menu items are displayed.
 *
 * @param tab - tab to base update of context menus on
 */
async function updateMenus(tab: ManagerTab): Promise<void> {
	if (tab.mode === ControllerMode.Unsupported) {
		browser.contextMenus.update(contextMenus.ENABLE_CONNECTOR, {
			visible: false,
		});
		browser.contextMenus.update(contextMenus.DISABLE_CONNECTOR, {
			visible: false,
		});
		browser.contextMenus.update(contextMenus.DISABLE_UNTIL_CLOSED, {
			visible: false,
		});
		return;
	}

	const tabData = await browser.tabs.get(tab.tabId);
	const connector = await getConnectorByUrl(tabData.url ?? '');
	if (tab.mode === ControllerMode.Disabled) {
		browser.contextMenus.update(contextMenus.ENABLE_CONNECTOR, {
			visible: true,
			title: t('menuEnableConnector', connector?.label),
		});
		browser.contextMenus.update(contextMenus.DISABLE_CONNECTOR, {
			visible: false,
		});
		browser.contextMenus.update(contextMenus.DISABLE_UNTIL_CLOSED, {
			visible: false,
		});
		return;
	}

	browser.contextMenus.update(contextMenus.ENABLE_CONNECTOR, {
		visible: false,
	});
	browser.contextMenus.update(contextMenus.DISABLE_CONNECTOR, {
		visible: true,
		title: t('menuDisableConnector', connector?.label),
	});
	browser.contextMenus.update(contextMenus.DISABLE_UNTIL_CLOSED, {
		visible: true,
		title: t('menuDisableUntilTabClosed', connector?.label),
	});
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

	browser.action.setIcon({
		path: {
			19: getIconURL(
				`icons/page_action_${tab.mode.toLowerCase()}_19_${await getIconType(
					tab.tabId
				)}.png`
			),
			38: getIconURL(
				`icons/page_action_${tab.mode.toLowerCase()}_38_${await getIconType(
					tab.tabId
				)}.png`
			),
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
 * @param tabId - ID of tab action is being set from, used to get theme.
 *
 * @returns the icon type to display.
 */
async function getIconType(tabId: number) {
	if (!browser.notifications) {
		return 'safari';
	}

	if (
		await sendBackgroundMessage(tabId, {
			type: 'isDarkModePreferred',
			payload: undefined,
		})
	) {
		return 'dark';
	}
	return 'light';
}
