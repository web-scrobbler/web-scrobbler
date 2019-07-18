'use strict';

/**
 * StorageArea object stub.
 */
class StorageAreaStub {
	constructor() {
		this.data = {};
	}

	get() {
		return this.data;

	}

	set(data) {
		this.data = Object.assign(this.data, data);
	}

	remove(key) {
		delete this.data[key];
	}
}

/**
 * Browser object stub.
 * @type {Object}
 */
const browser = {
	storage: {
		local: new StorageAreaStub(),
		sync: new StorageAreaStub()
	}
};

define([], () => browser);
