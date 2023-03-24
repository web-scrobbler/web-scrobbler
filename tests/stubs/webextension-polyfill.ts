/**
 * StorageArea object stub.
 */
export class StorageAreaStub {
	private data: Record<string, unknown>;
	constructor() {
		this.data = {};
	}

	get() {
		return this.data;
	}

	set(data: Record<string, unknown>) {
		this.data = Object.assign(this.data, data);
	}

	remove(key: string) {
		delete this.data[key];
	}
}

/**
 * Browser object stub.
 */
export const browser = {
	storage: {
		local: new StorageAreaStub(),
		sync: new StorageAreaStub(),
	},
};
