import * as ControllerMode from '@/core/object/controller/controller-mode';
import * as BrowserStorage from '@/core/storage/browser-storage';
import { ManagerTab } from '@/core/storage/wrapper';
import {
	backgroundListener,
	sendBackgroundMessage,
	setupBackgroundListeners,
} from '@/util/communication';
import browser from 'webextension-polyfill';
import {
	DEFAULT_STATE,
	contextMenus,
	getState,
	filterInactiveTabs,
	setState,
	unlockState,
	enableConnector,
	disableConnector,
	disableUntilClosed,
	updateTabsFromTabList,
	getCurrentTab,
	getActiveTabDetails,
	getCurrentTabId,
} from './util';
import {
	ControllerModeStr,
	isPrioritizedMode,
} from '@/core/object/controller/controller';
import { CloneableSong } from '@/core/object/song';
import {
	clearNowPlaying,
	showNowPlaying,
	showSongNotRecognized,
} from '@/util/notifications';
import ClonedSong from '@/core/object/cloned-song';
import { openTab } from '@/util/util-browser';
import { setRegexDefaults } from '@/util/regex';
import { getSongInfo, scrobble, sendNowPlaying, toggleLove } from './scrobble';

const disabledTabs = BrowserStorage.getStorage(BrowserStorage.DISABLED_TABS);

// Set up listeners. These must all be synchronously set up at startup time (Manifest V3 service worker)
browser.runtime.onStartup.addListener(startupFunc);
browser.runtime.onInstalled.addListener(startupFunc);
browser.tabs.onRemoved.addListener(onTabRemoved);
browser.tabs.onUpdated.addListener(onTabUpdated);
browser.tabs.onActivated.addListener(onTabActivated);
browser.contextMenus?.onClicked.addListener(contextMenuHandler);
browser.commands?.onCommand.addListener(commandHandler);

/**
 * Handle user commands (hotkeys) to the extension.
 *
 * @param command - The command that was used
 */
async function commandHandler(command: string) {
	const tab = await getCurrentTab();

	switch (command) {
		case 'toggle-connector':
			if (tab.mode === ControllerMode.Disabled) {
				enableConnector(tab.tabId);
			} else {
				disableConnector(tab.tabId);
			}
			break;
		case 'love-song':
			setLoveStatus(tab.tabId, true);
			break;
		case 'unlove-song':
			setLoveStatus(tab.tabId, false);
			break;
	}
}

/**
 * Set love status of song
 *
 * @param tabId	- Tab ID of the tab to update
 * @param isLoved - Whether the song is loved
 *
 */
function setLoveStatus(tabId: number, isLoved: boolean) {
	sendBackgroundMessage(tabId ?? -1, {
		type: 'toggleLove',
		payload: {
			isLoved: isLoved,
		},
	});
}

/**
 * Update action and context menus to reflect a tab being closed.
 *
 * @param tabId - tab ID of closed tab
 */
async function onTabRemoved(tabId: number) {
	const curState = await getState();

	const filteredTabs = await filterInactiveTabs(curState.activeTabs);
	await setState({
		activeTabs: filteredTabs,
		browserPreferredTheme: curState.browserPreferredTheme,
	});
	const newActiveTab = await getCurrentTabId();
	updateTabsFromTabList(filteredTabs, newActiveTab);

	const tabs = await disabledTabs.get();
	if (tabs?.[tabId]) {
		delete tabs[tabId];
		disabledTabs.set(tabs);
	}
}

/**
 * Update action and context menus to reflect the user switching the currently active tab.
 *
 * @param activeInfo - Information about the switch of tabs
 */
async function onTabActivated(
	activeInfo: browser.Tabs.OnActivatedActiveInfoType
) {
	await updateTabList(activeInfo.tabId, true);
}

/**
 * Update the active tabs list to reflect the order of priority.
 * We generally want information about more recently used tabs displayed first.
 *
 * @param tabId - currently active tab.
 * @param changeInfo - information about the change in tab.
 * @param tab - currently active tab details, if they exist.
 */
async function onTabUpdated(
	tabId: number,
	changeInfo: browser.Tabs.OnUpdatedChangeInfoType,
	tab?: browser.Tabs.Tab
) {
	if (tab?.active && changeInfo.status === 'complete') {
		await updateTabList(tabId, false);
	}
}

/**
 * Update the active tabs list to reflect the order of priority.
 * We generally want information about more recently used tabs displayed first.
 *
 * @param tabId - currently active tab.
 * @param activated - whether the tab was just activated or not.
 */
async function updateTabList(tabId: number, activated: boolean) {
	const curState = await getState();
	let newTabs = activated
		? curState.activeTabs.filter((active) => active.tabId !== tabId)
		: curState.activeTabs;

	const curTab = await getActiveTabDetails(newTabs, tabId);

	if (isPrioritizedMode[curTab.mode] && curTab.tabId === tabId) {
		if (activated) {
			newTabs = [curTab, ...newTabs];
		} else {
			newTabs = newTabs.map((active) =>
				active.tabId === tabId ? curTab : active
			);
		}
	}
	const filteredTabs = await filterInactiveTabs(newTabs);

	await setState({
		activeTabs: filteredTabs,
		browserPreferredTheme: curState.browserPreferredTheme,
	});
	updateTabsFromTabList(filteredTabs, tabId);
}

/**
 * Update the details of a tab to reflect a change in controller mode or song state.
 *
 * @param tabId - tab id to update details of
 * @param fn - function that mutates the old tab state to the updated tab state
 */
async function updateTab(
	tabId: number | undefined,
	fn: (tab: ManagerTab) => ManagerTab
): Promise<void> {
	if (!tabId) {
		throw new Error('No tabid given');
	}

	// perform the update, making sure there is no race condition, and making sure locking isnt permanently locked by an error
	let performedSet = false;
	try {
		const curState = await getState();
		const activeTabs = await filterInactiveTabs(curState.activeTabs);
		for (let i = 0; i < activeTabs.length; i++) {
			if (activeTabs[i].tabId !== tabId) {
				continue;
			}

			activeTabs[i] = fn(activeTabs[i]);
			performedSet = true;
			await setState({
				activeTabs,
				browserPreferredTheme: curState.browserPreferredTheme,
			});
			updateTabsFromTabList(activeTabs, tabId);
			return;
		}
		performedSet = true;
		const newTabs = [
			fn({
				tabId,
				mode: ControllerMode.Unsupported,
				song: null,
			}),
			...activeTabs,
		];
		await setState({
			activeTabs: newTabs,
			browserPreferredTheme: curState.browserPreferredTheme,
		});
		updateTabsFromTabList(activeTabs, tabId);
	} catch (err) {
		if (!performedSet) {
			unlockState();
		}
	}
}

/**
 * Update the controller mode of a specified tab.
 *
 * @param tabId - ID of the tab to update mode of
 * @param mode - New controller mode
 */
async function updateMode(tabId: number | undefined, mode: ControllerModeStr) {
	await updateTab(tabId, (oldTab) => ({
		tabId: oldTab.tabId,
		mode,
		song: oldTab.song,
	}));
}

/**
 * Update the currently playing song of a specified tab.
 *
 * @param tabId - ID of the tab to update song of
 * @param song - New song
 */
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

// Set up listeners for messages from content scripts and popup/settings script. Must be set synchronously on first script run.
setupBackgroundListeners(
	/**
	 * Listener triggered on change of controller mode in a tab.
	 */
	backgroundListener({
		type: 'controllerModeChange',
		fn: (mode, sender) => {
			updateMode(sender.tab?.id, mode);
			console.log(`changed mode to ${mode} in tab ${sender.tab?.id}`);
		},
	}),

	/**
	 * Listener triggered on change of currently playing song in a tab.
	 */
	backgroundListener({
		type: 'songUpdate',
		fn: (song, sender) => {
			updateState(sender.tab?.id, song);
			console.log(`song changed in tab ${sender.tab?.id}`);
			console.log(song);
		},
	}),

	/**
	 * Listener called by content script that wants to know the tab ID of the tab it is connected to.
	 * Returns the tab ID of the content script.
	 */
	backgroundListener({
		type: 'getTabId',
		fn: (payload, sender) => {
			console.log('getting tab id');
			console.log(payload, sender.tab?.id);
			return sender.tab?.id;
		},
	}),

	/**
	 * Listener called by a controller to trigger a now playing notification.
	 */
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

	/**
	 * Listener called by a controller to trigger sending of now playing info.
	 */
	backgroundListener({
		type: 'setNowPlaying',
		fn: (payload, sender) => {
			return sendNowPlaying(
				new ClonedSong(payload.song, sender.tab?.id ?? -1)
			);
		},
	}),

	/**
	 * Listener called by a controller to trigger a scrobble.
	 */
	backgroundListener({
		type: 'scrobble',
		fn: (payload, sender) => {
			return scrobble(new ClonedSong(payload.song, sender.tab?.id ?? -1));
		},
	}),

	/**
	 * Listener called by a controller to trigger getting song info.
	 */
	backgroundListener({
		type: 'getSongInfo',
		fn: (payload, sender) => {
			return getSongInfo(
				new ClonedSong(payload.song, sender.tab?.id ?? -1)
			);
		},
	}),

	/**
	 * Listener called by a controller to love or unlove a song.
	 */
	backgroundListener({
		type: 'toggleLove',
		fn: (payload, sender) => {
			return toggleLove(
				new ClonedSong(payload.song, sender.tab?.id ?? -1),
				payload.isLoved
			);
		},
	}),

	/**
	 * Listener called by a controller to trigger clearing now playing notification.
	 */
	backgroundListener({
		type: 'clearNowPlaying',
		fn: (payload, sender) => {
			clearNowPlaying(new ClonedSong(payload.song, sender.tab?.id ?? -1));
		},
	}),

	/**
	 * Listener called by a controller to trigger showing a notification telling the user the song was not recognized.
	 */
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
	}),

	/**
	 * Listener called by a content script to update the browser preferred theme.
	 */
	backgroundListener({
		type: 'updateTheme',
		fn: async (payload) => {
			const curState = await getState();
			await setState({
				activeTabs: curState.activeTabs,
				browserPreferredTheme: payload,
			});
		},
	})
);

/**
 * Sets up the starting state of the extension on browser startup/extension install.
 * Storage is used instead of variables, as with Manifest V3 service workers, script state cannot be guaranteed.
 */
function startupFunc() {
	const state = BrowserStorage.getStorage(BrowserStorage.STATE_MANAGEMENT);
	state.set(DEFAULT_STATE);
	disabledTabs.set({});

	setRegexDefaults();

	browser.contextMenus?.create({
		id: contextMenus.ENABLE_CONNECTOR,
		visible: false,
		contexts: ['action'],
		title: 'Error: You should not be seeing this',
	});

	browser.contextMenus?.create({
		id: contextMenus.DISABLE_CONNECTOR,
		visible: false,
		contexts: ['action'],
		title: 'Error: You should not be seeing this',
	});

	browser.contextMenus?.create({
		id: contextMenus.DISABLE_UNTIL_CLOSED,
		visible: false,
		contexts: ['action'],
		title: 'Error: You should not be seeing this',
	});
}

/**
 * Handles context menu click and takes appropriate action
 *
 * @param info - information about the context menu click event
 */
async function contextMenuHandler(info: browser.Menus.OnClickData) {
	const tab = await getCurrentTab();

	switch (info.menuItemId) {
		case contextMenus.ENABLE_CONNECTOR: {
			enableConnector(tab.tabId);
			break;
		}
		case contextMenus.DISABLE_CONNECTOR: {
			disableConnector(tab.tabId);
			break;
		}
		case contextMenus.DISABLE_UNTIL_CLOSED: {
			disableUntilClosed(tab.tabId);
			break;
		}
	}
}
