import { getConnectorByUrl } from '@/util/util-connector';
import * as ControllerMode from '@/core/object/controller/controller-mode';
import * as BrowserStorage from '@/core/storage/browser-storage';
import { ManagerTab } from '@/core/storage/wrapper';
import {
	backgroundListener,
	sendBackgroundMessage,
	sendPopupMessage,
	setupBackgroundListeners,
} from '@/util/communication';
import browser from 'webextension-polyfill';
import { fetchTab, filterInactiveTabs, getCurrentTab } from './util';
import { ControllerModeStr } from '@/core/object/controller/controller';
import { CloneableSong } from '@/core/object/song';
import { t } from '@/util/i18n';
import {
	clearNowPlaying,
	showNowPlaying,
	showSongNotRecognized,
} from '@/util/notifications';
import ClonedSong from '@/core/object/cloned-song';
import { openTab } from '@/util/util-browser';

const contextMenus = {
	ENABLE_CONNECTOR: 'enableConnector',
	DISABLE_CONNECTOR: 'disableConnector',
	DISABLE_UNTIL_CLOSED: 'disableUntilClosed',
};

const state = BrowserStorage.getStorage(BrowserStorage.STATE_MANAGEMENT);
const disabledTabs = BrowserStorage.getStorage(BrowserStorage.DISABLED_TABS);

browser.runtime.onStartup.addListener(startupFunc);
browser.runtime.onInstalled.addListener(startupFunc);

browser.tabs.onRemoved.addListener(async (tabId) => {
	const activeTabs = await fetchTab();

	await state.getLocking();
	await state.setLocking({
		activeTabs: await filterInactiveTabs(activeTabs),
	});
	updateAction();

	const tabs = await disabledTabs.get();
	if (tabs?.[tabId]) {
		delete tabs[tabId];
		disabledTabs.set(tabs);
	}
});

browser.tabs.onUpdated.addListener(async (tabId, _, tab) => {
	const { activeTabs } = (await state.getLocking()) ?? { activeTabs: [] };
	let curTab: ManagerTab = {
		tabId,
		mode: ControllerMode.Unsupported,
		song: null,
	};
	let newTabs =
		activeTabs?.filter((active) => {
			if (active.tabId !== tabId) {
				return true;
			}
			curTab = active;
			return false;
		}) ?? [];

	const connector = await getConnectorByUrl(tab.url ?? '');
	if (connector) {
		newTabs = [curTab, ...newTabs];
	}

	await state.setLocking({
		activeTabs: await filterInactiveTabs(newTabs),
	});
	updateAction();
});

async function updateTab(
	tabId: number | undefined,
	fn: (tab: ManagerTab) => ManagerTab
) {
	if (!tabId) {
		throw new Error('No tabid given');
	}

	// perform the update, making sure there is no race condition, and making sure locking isnt permanently locked by an error
	let performedSet = false;
	try {
		let { activeTabs } = (await state.getLocking()) ?? { activeTabs: [] };
		activeTabs = await filterInactiveTabs(activeTabs);
		for (let i = 0; i < activeTabs.length; i++) {
			if (activeTabs[i].tabId !== tabId) {
				continue;
			}

			activeTabs[i] = fn(activeTabs[i]);
			performedSet = true;
			await state.setLocking({ activeTabs });
			updateAction();
			return;
		}
		performedSet = true;
		await state.setLocking({
			activeTabs: [
				fn({
					tabId,
					mode: ControllerMode.Unsupported,
					song: null,
				}),
				...activeTabs,
			],
		});
		updateAction();
	} catch (err) {
		if (!performedSet) {
			state.unlock();
		}
	}
}

async function updateMode(tabId: number | undefined, mode: ControllerModeStr) {
	await updateTab(tabId, (oldTab) => ({
		tabId: oldTab.tabId,
		mode,
		song: oldTab.song,
	}));
	updateAction();
}

async function updateState(
	tabId: number | undefined,
	song: CloneableSong | null
) {
	await updateTab(tabId, (oldTab) => ({
		tabId: oldTab.tabId,
		mode: oldTab.mode,
		song,
	}));
}

setupBackgroundListeners(
	backgroundListener({
		type: 'controllerModeChange',
		fn: (mode, sender) => {
			updateMode(sender.tab?.id, mode);
			console.log(`changed mode to ${mode} in tab ${sender.tab?.id}`);
		},
	}),
	backgroundListener({
		type: 'songUpdate',
		fn: (song, sender) => {
			updateState(sender.tab?.id, song);
			console.log(`song changed in tab ${sender.tab?.id}`);
			console.log(song);
		},
	}),
	backgroundListener({
		type: 'getTabId',
		fn: (payload, sender) => {
			console.log('getting tab id');
			console.log(payload, sender.tab?.id);
			return sender.tab?.id;
		},
	}),
	backgroundListener({
		type: 'showNowPlaying',
		fn: (payload, sender) => {
			showNowPlaying(
				new ClonedSong(payload.song, sender.tab?.id ?? -1),
				payload.connector,
				() => {
					openTab(sender.tab?.id ?? -1);
				}
			);
		},
	}),
	backgroundListener({
		type: 'clearNowPlaying',
		fn: (payload, sender) => {
			clearNowPlaying(new ClonedSong(payload.song, sender.tab?.id ?? -1));
		},
	}),
	backgroundListener({
		type: 'showSongNotRecognized',
		fn: (payload, sender) => {
			showSongNotRecognized(
				new ClonedSong(payload.song, sender.tab?.id ?? -1),
				payload.connector,
				() => {
					openTab(sender.tab?.id ?? -1);
				}
			);
		},
	})
);

async function setAction(mode: ControllerModeStr): Promise<void> {
	await browser.action.setIcon({
		path: {
			19: browser.runtime.getURL(
				`icons/page_action_${mode.toLowerCase()}_19.png`
			),
			38: browser.runtime.getURL(
				`icons/page_action_${mode.toLowerCase()}_38.png`
			),
		},
	});
	await browser.action.setTitle({
		title: t(`pageAction${mode}`),
	});
}

async function updateAction() {
	const tab = await getCurrentTab();
	sendPopupMessage({
		type: 'currentTab',
		payload: tab,
	}).catch((err) => {
		console.warn(err);
	});

	await updateMenus(tab);
	await setAction(tab.mode);
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

function startupFunc() {
	state.set({
		activeTabs: [],
	});
	disabledTabs.set({});

	browser.contextMenus.create({
		id: contextMenus.ENABLE_CONNECTOR,
		visible: false,
		contexts: ['action'],
		title: 'Error: You should not be seeing this',
	});

	browser.contextMenus.create({
		id: contextMenus.DISABLE_CONNECTOR,
		visible: false,
		contexts: ['action'],
		title: 'Error: You should not be seeing this',
	});

	browser.contextMenus.create({
		id: contextMenus.DISABLE_UNTIL_CLOSED,
		visible: false,
		contexts: ['action'],
		title: 'Error: You should not be seeing this',
	});

	browser.contextMenus.onClicked.addListener(async (info) => {
		const tab = await getCurrentTab();

		switch (info.menuItemId) {
			case contextMenus.ENABLE_CONNECTOR: {
				sendBackgroundMessage(tab.tabId, {
					type: 'setConnectorState',
					payload: true,
				});
				break;
			}
			case contextMenus.DISABLE_CONNECTOR: {
				sendBackgroundMessage(tab.tabId, {
					type: 'setConnectorState',
					payload: false,
				});
				break;
			}
			case contextMenus.DISABLE_UNTIL_CLOSED: {
				sendBackgroundMessage(tab.tabId, {
					type: 'disableConnectorUntilTabIsClosed',
					payload: undefined,
				});
				break;
			}
		}
	});
}
