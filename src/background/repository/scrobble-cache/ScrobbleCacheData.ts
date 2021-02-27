import type { ScrobbleCacheEntry } from './ScrobbleCacheEntry';

export interface ScrobbleCacheData {
	[cacheEntryId: string]: ScrobbleCacheEntry;
}
