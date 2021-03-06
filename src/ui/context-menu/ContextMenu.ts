export interface ContextMenu {
	/**
	 * Add context menu item for a tab with the given tab ID.
	 *
	 * @param tabId Tab ID
	 * @param title Menu item title
	 * @param onClicked Function that will be executed on the item click
	 */
	addContextMenuItem(
		tabId: number,
		title: string,
		onClicked: OnContextMenuItemClicked
	): void;

	/**
	 * Remove all items from the context menu.
	 */
	resetContextMenu(): void;
}

export type OnContextMenuItemClicked = () => void;
