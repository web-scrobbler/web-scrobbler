export default class {
	data: unknown;

	constructor() {
		this.data = {};
	}

	async get(): Promise<unknown> {
		return Promise.resolve(this.data);
	}

	async set(data: unknown): Promise<void> {
		return new Promise((resolve) => {
			this.data = Object.assign(this.data, data);

			resolve();
		});
	}

	async remove(key: string): Promise<void> {
		return new Promise((resolve) => {
			delete this.data[key];

			resolve();
		});
	}

	async clear(): Promise<void> {
		return new Promise((resolve) => {
			this.data = {};

			resolve();
		});
	}
}
