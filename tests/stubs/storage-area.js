export default class {
	constructor() {
		this.data = {};
	}

	async get() {
		return this.data;
	}

	async set(data) {
		this.data = Object.assign(this.data, data);
	}

	async remove(key) {
		delete this.data[key];
	}
}
