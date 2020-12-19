import { Storage } from '@/background/storage2/Storage';
import { CustomUrlPatterns } from './CustomUrlPatterns';
import { CustomUrlPatternsData } from './CustomUrlPatternsData';

export class CustomUrlPatternsImpl implements CustomUrlPatterns {
	private patternsStorage: Storage<CustomUrlPatternsData>;

	constructor(storage: Storage<CustomUrlPatternsData>) {
		this.patternsStorage = storage;
	}

	async getPatterns(connectorId: string): Promise<string[]> {
		const storageData = await this.patternsStorage.get();
		return storageData[connectorId] || [];
	}

	async setPatterns(connectorId: string, patterns: string[]): Promise<void> {
		return this.patternsStorage.update({
			[connectorId]: patterns,
		});
	}

	async deletePatterns(connectorId: string): Promise<void> {
		const patterns = await this.patternsStorage.get();

		delete patterns[connectorId];
		return this.patternsStorage.set(patterns);
	}
}
