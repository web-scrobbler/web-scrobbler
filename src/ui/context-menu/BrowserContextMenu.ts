import { Menus } from 'webextension-polyfill-ts';

import {
	ContextMenu,
	OnContextMenuItemClicked,
} from '@/ui/context-menu/ContextMenu';

export class BrowserContextMenu implements ContextMenu {
	constructor(private contextMenu: Menus.Static) {}

	addContextMenuItem(
		tabId: number,
		title: string,
		onclick: OnContextMenuItemClicked
	): void {
		const type = 'normal';
		this.contextMenu.create({
			title,
			type,
			onclick,
			contexts: ['browser_action'],
		});
	}

	resetContextMenu(): void {
		this.contextMenu.removeAll();
	}
}
