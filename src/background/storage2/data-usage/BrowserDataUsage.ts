import { browser } from 'webextension-polyfill-ts';

import { DataUsage } from '@/background/storage2/DataUsage';

export class BrowserDataUsage implements DataUsage {
	getTotalSpaceSize(): number {
		return browser.storage.local.QUOTA_BYTES;
	}

	getUsedSpaceSize(): Promise<number> {
		// FIXME: Remove these comments once it's added to Firefox
		// @ts-ignore
		// eslint-disable-next-line
		return browser.storage.local.getBytesInUse(null);
	}
}
