import { vi } from 'vitest';

/**
 * StorageArea object stub.
 */
class StorageAreaStub {
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

	clear() {
		this.data = {};
	}
}

const messages = {
	getSongInfo: (payload: any) => {
		if (
			payload.song.processed.artist === 'フミンニッキ' &&
			payload.song.processed.track === 'Re:start'
		) {
			return Promise.resolve([
				{
					album: 'Re:start - EP',
				},
			]);
		}
		Promise.resolve([]);
	},
};

/**
 * Browser object stub.
 */
const browser = {
	storage: {
		local: new StorageAreaStub(),
		sync: new StorageAreaStub(),
	},
	runtime: {
		sendMessage: (payload: {
			type: string;
			payload: Record<string, unknown>;
			//@ts-ignore - we know that this is sound
		}) => messages[payload.type]?.(payload.payload) ?? Promise.resolve([]),
	},
};

class WebextensionPolyfillMocker {
	constructor() {
		vi.mock('webextension-polyfill', () => ({
			default: browser,
		}));
	}

	public setUser(): void {
		browser.storage.local.set({
			LastFM: {
				sessionID: 'no',
				sessionName: 'Enyachann',
			},
		});
	}

	public reset(): void {
		browser.storage.local.clear();
		browser.storage.sync.clear();
	}
}

export default new WebextensionPolyfillMocker();
