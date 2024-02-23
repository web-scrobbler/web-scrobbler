import { getConnectorByUrl } from '@/util/util-connector';
import { ManagerTab, StateManagement } from '@/core/storage/wrapper';
import browser from 'webextension-polyfill';
import * as ControllerMode from '@/core/object/controller/controller-mode';
import * as BrowserStorage from '@/core/storage/browser-storage';
import { isPrioritizedMode } from '@/core/object/controller/controller';
import { performUpdateAction } from './action';
import { sendBackgroundMessage } from '@/util/communication';
import { ConnectorMeta } from '../connectors';

const state = BrowserStorage.getStorage(BrowserStorage.STATE_MANAGEMENT);
const blocklistStorage = BrowserStorage.getStorage(BrowserStorage.BLOCKLISTS);

export const contextMenus = {
	ENABLE_CONNECTOR: 'enableConnector',
	DISABLE_CONNECTOR: 'disableConnector',
	DISABLE_UNTIL_CLOSED: 'disableUntilClosed',
	ENABLE_CHANNEL: 'enableChannel',
	DISABLE_CHANNEL: 'disableChannel',
};

/**
 * Filters asynchronously. Parallelized.
 *
 * @param arr - The array to filter
 * @param filter - The filtering function
 * @returns A promise that will resolve to the array without the entries where filter returned false.
 */
export async function filterAsync<T>(
	arr: T[],
	filter: (entry: T) => Promise<boolean>,
): Promise<T[]> {
	if (!arr) {
		return [];
	}

	const filters = [];
	for (const entry of arr) {
		filters.push(filter(entry));
	}
	const filteredArr = [];
	for (const [index, shouldKeep] of (await Promise.all(filters)).entries()) {
		if (shouldKeep) {
			filteredArr.push(arr[index]);
		}
	}
	return filteredArr;
}

/**
 * Remove irrelevant tabs from tab state.
 *
 * @param activeTabs - previous tab list
 * @returns tab list updated to filter out tabs that are no longer relevant
 */
export async function filterInactiveTabs(activeTabs: ManagerTab[]) {
	return filterAsync(activeTabs, async (entry) => {
		try {
			const tab = await browser.tabs.get(entry.tabId);
			await getConnectorByUrl(tab.url ?? '');
			return true;
		} catch (err) {
			return false;
		}
	});
}

/**
 * @param tabId - tab to get song from
 * @returns the details about the channel of the currently playing song in tab
 */
export async function getChannelDetails(tabId: number) {
	return sendBackgroundMessage(tabId, {
		type: 'getChannelDetails',
		payload: undefined,
	});
}

/**
 * Checks if current channel is blocklisted and returns its label if so
 *
 * @param channelId - ID of the channel to check
 * @param connector - Details about the connector to check
 * @returns string label of channel if current channel is blocklisted; null otherwise
 */
export async function getChannelBlocklistLabel(
	channelId: string,
	connector: ConnectorMeta,
): Promise<string | null> {
	const blocklist = (await blocklistStorage.get())?.[connector.id];
	if (!blocklist || !blocklist[channelId]) {
		return null;
	}
	return blocklist[channelId];
}

/**
 * Unlock state management storage.
 */
export function unlockState(): void {
	return state.unlock();
}

/**
 * Set state
 *
 * @param data - new state
 */
export async function setState(data: StateManagement): Promise<void> {
	return state.setLocking(data);
}

/**
 * Takes a list of tabs and updates the action state based on the first tab that matches a priority group.
 *
 * @param tabs - tabs from state
 * @param tabId - Currently active tab id if known
 * @returns the tab that was used to update the action state
 */
export async function updateTabsFromTabList(
	tabs: ManagerTab[],
	tabId?: number,
) {
	const curTab = await getActiveTabDetails(tabs, tabId);
	performUpdateAction(curTab);
	return curTab;
}

/**
 * Takes a list of tabs and returns the details of the first tab that matches a priority group.
 *
 * @param tabs - tabs from state
 * @param tabId - Currently active tab id if known
 * @returns the tab that was used to update the action state
 */
export async function getActiveTabDetails(
	tabs: ManagerTab[],
	tabId?: number,
): Promise<ManagerTab> {
	const tab = getPriorityTabDetails(tabs);
	let trueTabId = tabId;
	if (!trueTabId) {
		trueTabId = await getCurrentTabId();
	}
	const curTab = await getTabDetails(trueTabId);
	if (tab && !isPrioritizedMode[curTab.mode]) {
		return tab;
	}
	return curTab;
}

/**
 * Get the controller state of a tab.
 * @param tabId - tab to get state of
 * @returns the tab with controller details
 */
async function getTabDetails(tabId: number): Promise<ManagerTab> {
	try {
		const tab = await browser.tabs.get(tabId);
		if (!tab) {
			throw new Error('Tab not found');
		}
		const tabState = await sendBackgroundMessage(tabId, {
			type: 'getConnectorDetails',
			payload: undefined,
		});
		const curTab: ManagerTab = {
			tabId,
			mode: tabState.mode,
			permanentMode: tabState.permanentMode,
			song: tabState.song,
		};
		return curTab;
	} catch (err) {
		return {
			tabId,
			mode: ControllerMode.Unsupported,
			permanentMode: ControllerMode.Unsupported,
			song: null,
		};
	}
}

/**
 * Get the highest priority priority tab for action state.
 * This tab will be prioritized over the active tab.
 * @param tabs - list of priority tabs from state
 * @param tabId - Currently active tab id if known
 * @returns the tab that is the current priority for action state
 */
function getPriorityTabDetails(tabs: ManagerTab[]): ManagerTab | null {
	for (const tab of tabs) {
		if (isPrioritizedMode[tab.mode]) {
			return tab;
		}
	}
	return null;
}

/**
 * Returns the ID of the currently active tab in the browser.
 * @returns the current tab id
 */
export async function getCurrentTabId() {
	const queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	const [tab] = await browser.tabs.query(queryOptions);
	return tab?.id ?? -1;
}

/**
 * Gets the tab to base action and context menus on.
 * Generally, this prioritizes the most recent tab.
 * However, certain controller states are prioritized over other controller states.
 *
 * @returns tab details
 */
export async function getCurrentTab(): Promise<ManagerTab> {
	const curState = (await state.get()) ?? DEFAULT_STATE;
	return getActiveTabDetails(curState.activeTabs);
}

/**
 * Helper that fetches current state, and returns base object if nothing is fetched. Locking.
 *
 * @returns current state
 */
export async function getState(): Promise<StateManagement> {
	const curState = (await state.getLocking()) ?? DEFAULT_STATE;
	return curState;
}

/**
 * Gets the current browser preferred theme, does not lock.
 *
 * @returns the current browser preferred theme.
 */
export async function getBrowserPreferredTheme(): Promise<'light' | 'dark'> {
	return (await state.get())?.browserPreferredTheme ?? 'light';
}

/**
 * Default storage state
 */
export const DEFAULT_STATE: StateManagement = {
	activeTabs: [],
	browserPreferredTheme: 'light',
};

/**
 * Disables connector of a tab
 *
 * @param tabId - tab id of tab to disable connector of
 */
export function disableConnector(tabId: number) {
	sendBackgroundMessage(tabId, {
		type: 'setConnectorState',
		payload: false,
	});
}

/**
 * Enables connector of a tab
 *
 * @param tabId - tab id of tab to enable connector of
 */
export function enableConnector(tabId: number) {
	sendBackgroundMessage(tabId, {
		type: 'setConnectorState',
		payload: true,
	});
}

/**
 * Disables scrobbling current channel for a tab
 *
 * @param tabId - tab id of tab to disable scrobbling channel for
 */
export function addToBlocklist(tabId: number) {
	sendBackgroundMessage(tabId, {
		type: 'addToBlocklist',
		payload: undefined,
	});
}

/**
 * Enables scrobbling current channel for a tab
 *
 * @param tabId - tab id of tab to enable scrobbling channel for
 */
export function removeFromBlocklist(tabId: number) {
	sendBackgroundMessage(tabId, {
		type: 'removeFromBlocklist',
		payload: undefined,
	});
}

/**
 * Disables connector of a tab until the tab is closed
 *
 * @param tabId - tab id of tab to disable connector of
 */
export function disableUntilClosed(tabId: number) {
	sendBackgroundMessage(tabId, {
		type: 'disableConnectorUntilTabIsClosed',
		payload: undefined,
	});
}
