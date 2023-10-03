import * as BrowserStorage from '@/core/storage/browser-storage';

export default class Blocklist {
	private storage = BrowserStorage.getStorage(BrowserStorage.BLOCKLISTS);
	private connectorId: string;
	private isReady: Promise<true>;

	constructor(connectorId: string) {
		this.connectorId = connectorId;
		this.isReady = this.init();
	}

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
	private async init(): Promise<true> {
		await this.setupDefaultBlocklist();
		return true;
	}

	public async addToBlocklist(id: string) {
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
		this.storage.setLocking(data);
	}

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
