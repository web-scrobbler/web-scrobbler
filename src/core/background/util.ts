import { getConnectorByUrl } from '@/util/util-connector';
import { ManagerTab, StateManagement } from '@/core/storage/wrapper';
import browser from 'webextension-polyfill';
import * as ControllerMode from '@/core/object/controller/controller-mode';
import * as BrowserStorage from '@/core/storage/browser-storage';
import { controllerModePriority } from '@/core/object/controller/controller';
import { performUpdateAction, updateAction } from './action';

const state = BrowserStorage.getStorage(BrowserStorage.STATE_MANAGEMENT);

export const contextMenus = {
	ENABLE_CONNECTOR: 'enableConnector',
	DISABLE_CONNECTOR: 'disableConnector',
	DISABLE_UNTIL_CLOSED: 'disableUntilClosed',
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
	filter: (entry: T) => Promise<boolean>
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
 * Checks if the tab is still active and supported.
 *
 * @param tab - State Manager tab instance
 * @returns true if tab is still open and on a URL that web scrobbler supports, false otherwise
 */
async function checkIfActive(tab: ManagerTab) {
	try {
		const tabDetails = await browser.tabs.get(tab.tabId);
		const connector = await getConnectorByUrl(tabDetails.url ?? '');
		return Boolean(connector);
	} catch (err) {
		return false;
	}
}

/**
 * Update all tabs of state storage
 *
 * @param state - State Management storage content
 * @returns State Management storage content without inactive tabs and with state updated
 */
async function updateTabs(state: StateManagement): Promise<StateManagement> {
	state.activeTabs = await filterAsync(state.activeTabs, checkIfActive);
	return state;
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
 * Unlock state management storage.
 */
export function unlockState(): void {
	return state.unlock();
}

/**
 * Get current tab list
 *
 * @returns tab list
 */
export async function getState(): Promise<StateManagement | null> {
	return state.getLocking();
}

/**
 * Set tab list
 *
 * @param data - new tab list
 */
export async function setState(data: StateManagement): Promise<void> {
	return state.setLocking(data);
}

/**
 * Gets the tab to base action and context menus on.
 * Generally, this prioritizes the most recent tab.
 * However, certain controller states are prioritized over other controller states.
 *
 * @returns tab details
 */
export async function getCurrentTab(): Promise<ManagerTab> {
	const { activeTabs } = (await state.getLocking()) ?? { activeTabs: [] };
	const filteredTabs = await filterInactiveTabs(activeTabs);
	void state.setLocking({
		activeTabs: filteredTabs,
	});

	for (const priorityGroup of controllerModePriority) {
		for (const tab of activeTabs) {
			if (priorityGroup.includes(tab.mode)) {
				performUpdateAction(tab);
				return tab;
			}
		}
	}
	const defaultTab: ManagerTab = {
		tabId: -1,
		mode: ControllerMode.Unsupported,
		song: null,
	};
	performUpdateAction(defaultTab);
	return defaultTab;
}

/**
 * Helper that fetches tab list, and returns empty array if an improper response is received.
 *
 * @returns active tab list
 */
export async function fetchTab() {
	const { activeTabs } = (await state.get()) ?? { activeTabs: [] };
	return activeTabs;
}
