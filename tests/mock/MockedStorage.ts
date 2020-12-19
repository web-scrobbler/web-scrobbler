import { Storage } from '@/background/storage2/Storage';

/**
 * In-memory `Storage` implementation.
 */
export class MockedStorage<T> implements Storage<T> {
	constructor(private data: T = {} as T) {}

	async get(): Promise<T> {
		return Promise.resolve(this.data);
	}

	async set(data: T): Promise<void> {
		return new Promise((resolve) => {
			this.data = data;

			resolve();
		});
	}

	async update(data: Partial<T>): Promise<void> {
		return new Promise((resolve) => {
			this.data = Object.assign(this.data, data);

			resolve();
		});
	}

	async clear(): Promise<void> {
		return new Promise((resolve) => {
			this.data = {} as T;

			resolve();
		});
	}
}
