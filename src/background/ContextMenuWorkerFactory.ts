import { browser } from 'webextension-polyfill-ts';

import { BrowserContextMenuManager } from '@/background/browser/context-menu/BrowserContextMenuManager';
import { ContextMenuWorker } from '@/background/ContextMenuWorker';
import { TabWorker } from '@/background/object/tab-worker';

export function createContextMenuWorker(
	tabWorker: TabWorker
): ContextMenuWorker {
	const browserContextMenuManager = new BrowserContextMenuManager(
		browser.contextMenus
	);

	return new ContextMenuWorker(tabWorker, browserContextMenuManager);
}

export type ContextMenuWorkerFactory = (
	tabWorker: TabWorker
) => ContextMenuWorker;
