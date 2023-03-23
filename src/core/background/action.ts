import browser from 'webextension-polyfill';
import { contextMenus, getCurrentTab } from './util';
import { sendPopupMessage } from '@/util/communication';
import { ManagerTab } from '@/core/storage/wrapper';
import * as ControllerMode from '@/core/object/controller/controller-mode';
import { getConnectorByUrl } from '@/util/util-connector';
import { t } from '@/util/i18n';
import { ControllerModeStr } from '@/core/object/controller/controller';
import { CloneableSong } from '@/core/object/song';
import ClonedSong from '@/core/object/cloned-song';

export async function updateAction() {
	const tab = await getCurrentTab();
	sendPopupMessage({
		type: 'currentTab',
		payload: tab,
	}).catch((err) => {
		console.warn(err);
	});

	await updateMenus(tab);
	setAction(tab.mode, tab.song);
}

async function updateMenus(tab: ManagerTab) {
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

function getIconURL(url: string) {
	const runtimeURL = browser.runtime.getURL(url);
	if (runtimeURL.startsWith('safari')) {
		return url;
	}
	return runtimeURL;
}

function setAction(mode: ControllerModeStr, song: CloneableSong | null): void {
	let songstr = '';
	if (song) {
		const clonedSong = new ClonedSong(song, -1);
		songstr = `${clonedSong.getArtist()} - ${clonedSong.getTrack()}`;
	}

	browser.action.setIcon({
		path: {
			19: getIconURL(`icons/page_action_${mode.toLowerCase()}_19.png`),
			38: getIconURL(`icons/page_action_${mode.toLowerCase()}_38.png`),
		},
	});
	browser.action.setTitle({
		title: t(`pageAction${mode}`, songstr),
	});
}
