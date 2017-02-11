'use strict';

/**
 * Chrome StorageArea object stub.
 */
class StorageAreaStub {
	constructor() {
		this.data = {};
	}

	get(cb) {
		cb(this.data);

	}

	set(data, cb) {
		this.data = Object.assign(data, this.data);
		cb();
	}

	remove(key, cb) {
		delete this.data[key];
		cb();
	}
}

/**
 * Chrome object stub.
 * @type {Object}
 */
const chrome = {
	runtime: {
		lastError: null,
	},
	storage: {
		local: new StorageAreaStub(),
		sync: new StorageAreaStub()
	}
};

define([], function() {
	return chrome;
});
