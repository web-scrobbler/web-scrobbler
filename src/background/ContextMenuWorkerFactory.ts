import { browser } from 'webextension-polyfill-ts';

import { BrowserContextMenu } from '@/ui/context-menu/BrowserContextMenu';
import { ContextMenuWorker } from '@/background/ContextMenuWorker';
import { TabWorker } from '@/background/object/tab-worker';

export function createContextMenuWorker(
	tabWorker: TabWorker
): ContextMenuWorker {
	const browserContextMenuManager = new BrowserContextMenu(
		browser.contextMenus
	);

	return new ContextMenuWorker(tabWorker, browserContextMenuManager);
}

export type ContextMenuWorkerFactory = (
	tabWorker: TabWorker
) => ContextMenuWorker;
