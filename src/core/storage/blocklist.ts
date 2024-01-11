import * as BrowserStorage from '@/core/storage/browser-storage';

export default class Blocklist {
	private storage = BrowserStorage.getStorage(BrowserStorage.BLOCKLISTS);
	private connectorId: string;
	private isReady: Promise<true>;

	constructor(connectorId: string) {
		this.connectorId = connectorId;
		this.isReady = this.init();
	}

	/**
	 * Sets default values to blocklist if necessary
	 */
	private async setupDefaultBlocklist() {
		let data = await this.storage.getLocking();
		if (!data) {
			data = {};
		}
		if (!(this.connectorId in data) || !data[this.connectorId]) {
			data[this.connectorId] = {};
		}
		await this.storage.setLocking(data);
	}

	/**
	 * Initializes the blocklist with default values
	 */
	private async init(): Promise<true> {
		await this.setupDefaultBlocklist();
		return true;
	}

	/**
	 * Adds a channel ID to blocklist
	 *
	 * @param id - ID of channel to add
	 */
	public async addToBlocklist(id: string): Promise<void> {
		if (!id) {
			return;
		}
		await this.isReady;
		const data = await this.storage.getLocking();
		if (!data || !(this.connectorId in data) || !data[this.connectorId]) {
			this.storage.unlock();
			return;
		}
		data[this.connectorId] = {
			...data[this.connectorId],
			[id]: true,
		};
		await this.storage.setLocking(data);
	}

	/**
	 * Removes a channel ID from blocklist
	 *
	 * @param id - ID of channel to remove
	 */
	public async removeFromBlocklist(id: string) {
		if (!id) {
			return;
		}
		await this.isReady;
		const data = await this.storage.getLocking();
		if (!data || !(this.connectorId in data) || !data[this.connectorId]) {
			this.storage.unlock();
			return;
		}
		delete data[this.connectorId][id];
		this.storage.setLocking(data);
	}

	/**
	 * @param id - ID of channel to check
	 *
	 * @returns true if channel isn't blocklisted; false if it is
	 */
	public async shouldScrobbleChannel(
		id: string | undefined | null,
	): Promise<boolean> {
		if (!id) {
			return true;
		}
		await this.isReady;
		const data = await this.storage.get();
		if (!data || !(this.connectorId in data) || !data[this.connectorId]) {
			return true;
		}

		return data[this.connectorId][id] !== true;
	}
}
