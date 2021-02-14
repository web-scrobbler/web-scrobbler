import { Menus } from 'webextension-polyfill-ts';

import {
	ContextMenuMananger,
	OnContextMenuItemClicked,
} from '@/background/browser/context-menu/ContextMenuManager';

export class BrowserContextMenuManager implements ContextMenuMananger {
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
