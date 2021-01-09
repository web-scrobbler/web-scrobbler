import { browser } from 'webextension-polyfill-ts';

import { DataUsage } from '@/background/storage2/DataUsage';

export class FirefoxBrowserDataUsage implements DataUsage {
	getTotalSpaceSize(): number {
		return browser.storage.local.QUOTA_BYTES;
	}

	async getUsedSpaceSize(): Promise<number> {
		// Ref: https://bugzilla.mozilla.org/show_bug.cgi?id=1385832
		const data = await browser.storage.sync.get();

		return new TextEncoder().encode(
			Object.entries(data)
				.map(([key, value]) => key + JSON.stringify(value))
				.join('')
		).length;
	}
}
