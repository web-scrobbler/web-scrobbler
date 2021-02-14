export interface ContextMenuMananger {
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
