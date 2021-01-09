import { DataUsage } from '@/background/storage2/DataUsage';

import { BrowserDataUsage } from '@/background/storage2/data-usage/BrowserDataUsage';
import { FirefoxBrowserDataUsage } from '@/background/storage2/data-usage/FirefoxBrowserDataUsage';

export function getDataUsage(): DataUsage {
	return dataUsage;
}

let dataUsage: DataUsage;

/* @ifdef CHROME */
dataUsage = new BrowserDataUsage();
/* @endif */

/* @ifdef FIREFOX */
dataUsage = new FirefoxBrowserDataUsage();
/* @endif */
