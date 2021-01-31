import type { ConnectorState } from '@/background/model/ConnectorState';

export interface BrowserTabListener {
	/**
	 * Called when a command is executed.
	 *
	 * @param command Command ID
	 */
	processCommand(command: string): void;

	/**
	 * Called when a current tab is changed.
	 *
	 * @param tabId Tab ID
	 */
	processTabChange(tabId: number): void;

	/**
	 * Called when a tab is removed.
	 *
	 * @param removedTabId Tab ID
	 */
	processTabRemove(removedTabId: number): void;

	/**
	 * Called when a tab is updated.
	 *
	 * @param tabId Tab ID
	 * @param url URL
	 */
	processTabUpdate(tabId: number, url: string): void;

	/**
	 * Called when something sent message to the background script.
	 *
	 * @param tabId ID of a tab to which the message is addressed
	 * @param message Message
	 */
	processConnectorState(tabId: number, state: ConnectorState): void;
}
