import * as ControllerMode from '@/core/object/controller/controller-mode';
import * as BrowserStorage from '@/core/storage/browser-storage';
import type { ManagerTab } from '@/core/storage/wrapper';
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
	addToBlocklist,
	removeFromBlocklist,
} from './util';
import type { ControllerModeStr } from '@/core/object/controller/controller';
import { isPrioritizedMode } from '@/core/object/controller/controller';
import type { CloneableSong } from '@/core/object/song';
import {
	clearNowPlaying,
	showAuthNotification,
	showLovedNotification,
	showNowPlaying,
	showSongNotRecognized,
} from '@/util/notifications';
import ClonedSong from '@/core/object/cloned-song';
import { openTab } from '@/util/util-browser';
import { setRegexDefaults } from '@/util/regex';
import { attemptInjectAllTabs } from './inject';
import {
	getSongInfo,
	scrobble,
	sendNowPlaying,
	sendPaused,
	sendResumedPlaying,
	toggleLove,
} from './scrobble';
import scrobbleService from '../object/scrobble-service';
import { fetchListenBrainzProfile } from '@/util/util';

const disabledTabs = BrowserStorage.getStorage(BrowserStorage.DISABLED_TABS);

// Set up listeners. These must all be synchronously set up at startup time (Manifest V3 service worker)
browser.runtime.onStartup.addListener(onStartup);
browser.runtime.onInstalled.addListener(onInstalled);
browser.tabs.onRemoved.addListener((tabId) => void onTabRemoved(tabId));
browser.tabs.onUpdated.addListener(
	(tabId, changeInfo, tab) => void onTabUpdated(tabId, changeInfo, tab),
);
browser.tabs.onActivated.addListener(
	(activeInfo) => void onTabActivated(activeInfo),
);
browser.contextMenus?.onClicked.addListener(
	(info) => void contextMenuHandler(info),
);
browser.commands?.onCommand.addListener(
	(command) => void commandHandler(command),
);

/**
 * Handle user commands (hotkeys) to the extension.
 *
 * @param command - The command that was used
 */
async function commandHandler(command: string) {
	const tab = await getCurrentTab();
	const alreadyLoved = tab.song?.metadata.userloved;

	switch (command) {
		case 'toggle-connector':
			if (tab.mode === ControllerMode.Disabled) {
				enableConnector(tab.tabId);
			} else {
				disableConnector(tab.tabId);
			}
			break;
		case 'love-song':
			// only set love status if song is not yet loved, ignore if song is already loved
			// only send notification when song is unloved but will be loved
			if (!alreadyLoved) {
				setLoveStatus(tab.tabId, true, true);
			}
			break;
		case 'unlove-song':
			// only set unlove status if song is loved, ignore if song is unloved
			// only send notification when song is loved but will be unloved
			if (alreadyLoved) {
				setLoveStatus(tab.tabId, false, true);
			}
			break;
	}
}

/**
 * Set love status of song
 *
 * @param tabId	- Tab ID of the tab to update
 * @param isLoved - Whether the song is loved
 * @param shouldShowNotification - Whether the song should show notification when (un)loved
 *
 */
function setLoveStatus(
	tabId: number,
	isLoved: boolean,
	shouldShowNotification: boolean,
) {
	sendBackgroundMessage(tabId ?? -1, {
		type: 'toggleLove',
		payload: {
			isLoved,
			shouldShowNotification,
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
	activeInfo: browser.Tabs.OnActivatedActiveInfoType,
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
	tab?: browser.Tabs.Tab,
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
				active.tabId === tabId ? curTab : active,
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
	fn: (tab: ManagerTab) => ManagerTab,
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

			// this can be different from the tab of the script calling the mode change
			const activeTabId = await getCurrentTabId();
			updateTabsFromTabList(activeTabs, activeTabId);
			return;
		}
		performedSet = true;
		const newTabs = [
			fn({
				tabId,
				mode: ControllerMode.Unsupported,
				permanentMode: ControllerMode.Unsupported,
				song: null,
			}),
			...activeTabs,
		];
		await setState({
			activeTabs: newTabs,
			browserPreferredTheme: curState.browserPreferredTheme,
		});

		// this can be different from the tab of the script calling the mode change
		const activeTabId = await getCurrentTabId();
		updateTabsFromTabList(activeTabs, activeTabId);
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
async function updateMode(
	tabId: number | undefined,
	mode: ControllerModeStr,
	permanentMode: ControllerModeStr,
) {
	await updateTab(tabId, (oldTab) => ({
		tabId: oldTab.tabId,
		mode,
		permanentMode,
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
	song: CloneableSong | null,
) {
	await updateTab(tabId, (oldTab) => ({
		tabId: oldTab.tabId,
		mode: oldTab.mode,
		permanentMode: oldTab.permanentMode,
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
		fn: ({ mode, permanentMode }, sender) => {
			updateMode(sender.tab?.id, mode, permanentMode);
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
				},
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
				new ClonedSong(payload.song, sender.tab?.id ?? -1),
			);
		},
	}),

	/**
	 * Listener called by a controller to trigger sending paused song on every pause.
	 */
	backgroundListener({
		type: 'setPaused',
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		fn: (payload, sender) => {
			return sendPaused(
				new ClonedSong(payload.song, sender.tab?.id ?? -1),
			);
		},
	}),

	/**
	 * Listener called by a controller to trigger sending playing song on every resumed play.
	 */
	backgroundListener({
		type: 'setResumedPlaying',
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		fn: (payload, sender) => {
			return sendResumedPlaying(
				new ClonedSong(payload.song, sender.tab?.id ?? -1),
			);
		},
	}),

	/**
	 * Listener called by a controller to trigger a scrobble.
	 */
	backgroundListener({
		type: 'scrobble',
		fn: (payload, sender) => {
			return scrobble(
				payload.songs.map(
					(song) => new ClonedSong(song, sender.tab?.id ?? -1),
				),
				payload.currentlyPlaying,
			);
		},
	}),

	/**
	 * Listener called by a controller to trigger getting song info.
	 */
	backgroundListener({
		type: 'getSongInfo',
		fn: (payload, sender) => {
			return getSongInfo(
				new ClonedSong(payload.song, sender.tab?.id ?? -1),
			);
		},
	}),

	/**
	 * Listener called by a controller to love or unlove a song.
	 */
	backgroundListener({
		type: 'toggleLove',
		fn: (payload, sender) => {
			const song = new ClonedSong(payload.song, sender.tab?.id ?? -1);
			if (payload.shouldShowNotification) {
				showLovedNotification(song, payload.isLoved);
			}
			return toggleLove(song, payload.isLoved);
		},
	}),

	/**
	 * Listener called by a content script to attempt signing into musicbrainz.
	 * This has to be done in background script, as safari blocks sending necessary cookies in other scripts.
	 */
	backgroundListener({
		type: 'sendListenBrainzRequest',
		fn: async (payload) => fetchListenBrainzProfile(payload.url),
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
				},
			);
		},
	}),

	/**
	 * Listener called by a content script to update the browser preferred theme.
	 */
	backgroundListener({
		type: 'updateTheme',
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		fn: async (payload) => {
			const curState = await getState();
			await setState({
				activeTabs: curState.activeTabs,
				browserPreferredTheme: payload,
			});
		},
	}),

	/**
	 * Listener called by a content script to fetch through background script.
	 */
	backgroundListener({
		type: 'fetch',
		fn: async ({ url, init }) => {
			const res = await fetch(url, init);
			if (!res.ok) {
				return {
					ok: false,
					content: '',
				};
			}
			return {
				ok: true,
				content: await res.text(),
			};
		},
	}),

	/**
	 * Listener called by a content script to figure out whether it is currently audible
	 */
	backgroundListener({
		type: 'isTabAudible',
		fn: async (_, sender) => {
			const tabId = sender.tab?.id;
			if (typeof tabId !== 'number') {
				return Promise.resolve(true);
			}

			return (await browser.tabs.get(tabId)).audible ?? true;
		},
	}),
);

/**
 * Replace the extension version stored in local storage by current one.
 */
async function updateVersionInStorage() {
	const storage = BrowserStorage.getStorage(BrowserStorage.CORE);
	let data = await storage.get();
	if (!data) {
		data = {
			appVersion: '',
		};
	}

	data.appVersion = browser.runtime.getManifest().version;
	await storage.set(data);

	storage.debugLog();
}

/**
 * Ask a scrobble service to bind scrobblers.
 *
 * @returns true if at least one scrobbler is registered;
 *          false if no scrobblers are registered
 */
async function bindScrobblers() {
	const boundScrobblers = await scrobbleService.bindAllScrobblers();
	return boundScrobblers.length > 0;
}

/**
 * Sets up the starting state of the extension on browser startup/extension install.
 * Storage is used instead of variables, as with Manifest V3 service workers, script state cannot be guaranteed.
 */
function onStartup() {
	const state = BrowserStorage.getStorage(BrowserStorage.STATE_MANAGEMENT);
	state.set(DEFAULT_STATE);
	disabledTabs.set({});

	setRegexDefaults();
	updateVersionInStorage();
	bindScrobblers().then((bound) => {
		if (!bound) {
			console.warn('No scrobblers are bound');
			showAuthNotification();
		}
	});

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

	browser.contextMenus.create({
		id: contextMenus.ENABLE_CHANNEL,
		visible: false,
		contexts: ['action'],
		title: 'Error: You should not be seeing this',
	});

	browser.contextMenus.create({
		id: contextMenus.DISABLE_CHANNEL,
		visible: false,
		contexts: ['action'],
		title: 'Error: You should not be seeing this',
	});
}

/**
 * To be ran on install/update. Does all the things extension does on startup,
 * and also injects the content script into all eligible tabs as the old ones have been invalidated.
 */
function onInstalled() {
	onStartup();
	attemptInjectAllTabs();
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
		case contextMenus.ENABLE_CHANNEL: {
			removeFromBlocklist(tab.tabId);
			break;
		}
		case contextMenus.DISABLE_CHANNEL: {
			addToBlocklist(tab.tabId);
			break;
		}
	}
}
