import * as BrowserStorage from '@/core/storage/browser-storage';
import type { ChannelInfo } from '../content/util';

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
	public async addToBlocklist(
		channelInfo: ChannelInfo | null,
	): Promise<void> {
		if (!channelInfo?.id) {
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
			[channelInfo.id]: channelInfo.label || channelInfo.id,
		};
		await this.storage.setLocking(data);
	}

	/**
	 * Removes a channel ID from blocklist
	 *
	 * @param id - ID of channel to remove
	 */
	public async removeFromBlocklist(id: string | null) {
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
	 * @returns label if channel is blocklisted; null if it isn't
	 */
	public async getChannelLabel(
		id: string | undefined | null,
	): Promise<string | null> {
		if (!id) {
			return null;
		}
		await this.isReady;
		const data = await this.storage.get();
		if (!data || !(this.connectorId in data) || !data[this.connectorId]) {
			return null;
		}

		return data[this.connectorId][id];
	}

	/**
	 * @param id - ID of channel to check
	 *
	 * @returns true if channel isn't blocklisted; false if it is.
	 */
	public async shouldScrobbleChannel(
		id: string | undefined | null,
	): Promise<boolean> {
		return !(await this.getChannelLabel(id));
	}
}
