import { SCROBBLE_CACHE } from './browser-storage';
import { CustomStorage } from './custom-storage';
import { CacheScrobble, CacheScrobbleData, DataModels } from './wrapper';

type K = typeof SCROBBLE_CACHE;
type V = DataModels[K];
type T = Record<K, V>;

export default abstract class ScrobbleCacheModel extends CustomStorage<K> {
	public abstract getScrobbleCacheStorage(): Promise<CacheScrobble[] | null>;
	public abstract getScrobbleCacheStorageLocking(): Promise<
		CacheScrobble[] | null
	>;
	public abstract saveScrobbleCacheToStorage(data: T[K]): Promise<void>;
	public abstract saveScrobbleCacheToStorageLocking(
		data: T[K],
	): Promise<void>;
	private MAX_SCROBBLE_CACHE_SIZE = 1000;

	/**
	 * Replace the data for a scrobble in the scrobble cache
	 *
	 * @param id - ID of the scrobble to modify
	 * @param scrobble - data to replace it with
	 */
	async replaceScrobble(
		id: number,
		scrobble: CacheScrobbleData,
	): Promise<void> {
		const storageData = await this.getScrobbleCacheStorageLocking();
		if (!storageData) {
			return;
		}

		for (let i = 0; i < storageData.length; i++) {
			if (storageData[i].id === id) {
				storageData[i] = {
					...scrobble,
					id,
				};
			}
		}
		await this.saveScrobbleCacheToStorageLocking(storageData);
	}

	/**
	 * Save scrobble to the storage.
	 *
	 * @param scrobble - {@link CacheScrobbleData} to save
	 *
	 * @returns the id of the new scrobble
	 */
	async pushScrobble(scrobble: CacheScrobbleData): Promise<number> {
		const storageData = await this.getScrobbleCacheStorageLocking();
		if (storageData === null) {
			await this.saveScrobbleCacheToStorageLocking([
				{
					...scrobble,
					id: 1,
				},
			]);
			return 1;
		}

		const id = (storageData.at(-1)?.id ?? 0) + 1;
		storageData.push({
			...scrobble,
			id,
		});

		// limit how much we store
		await this.saveScrobbleCacheToStorageLocking(
			storageData.slice(-this.MAX_SCROBBLE_CACHE_SIZE),
		);
		return id;
	}

	async deleteScrobbles(ids: number[]): Promise<void> {
		const storageData = await this.getScrobbleCacheStorageLocking();
		if (!storageData) {
			return;
		}
		const scrobbleIdMap = new Map<number, boolean>();
		for (const id of ids) {
			scrobbleIdMap.set(id, true);
		}

		await this.saveScrobbleCacheToStorageLocking(
			storageData.filter((e) => scrobbleIdMap.get(e.id) !== true),
		);
	}
}
