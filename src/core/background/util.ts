import { getConnectorByUrl } from '@/util/util-connector';
import { ManagerTab, StateManagement } from '@/core/storage/wrapper';
import browser from 'webextension-polyfill';
import * as ControllerMode from '@/core/object/controller/controller-mode';
import * as BrowserStorage from '@/core/storage/browser-storage';
import { controllerModePriority } from '@/core/object/controller/controller';
import { performUpdateAction } from './action';

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
 * Set state
 *
 * @param data - new state
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
	const curState = await getState();
	const filteredTabs = await filterInactiveTabs(curState.activeTabs);
	await setState({
		activeTabs: filteredTabs,
		browserPreferredTheme: curState.browserPreferredTheme,
	});

	for (const priorityGroup of controllerModePriority) {
		for (const tab of filteredTabs) {
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
