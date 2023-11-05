import { hideObjectValue } from '@/util/util';
import browser from 'webextension-polyfill';
import {
	CONNECTORS_OPTIONS,
	CONNECTORS_OVERRIDE_OPTIONS,
	CORE,
	CUSTOM_PATTERNS,
	DISABLED_TABS,
	LOCAL_CACHE,
	NOTIFICATIONS,
	OPTIONS,
	REGEX_EDITS,
	STATE_MANAGEMENT,
	StorageNamespace,
} from '@/core/storage/browser-storage';
import {
	ConnectorOptions,
	ConnectorsOverrideOptions,
	GlobalOptions,
	SavedEdit,
} from '@/core/storage/options';
import { ControllerModeStr } from '@/core/object/controller/controller';
import { CloneableSong } from '@/core/object/song';
import EventEmitter from '@/util/emitter';
import connectors from '@/core/connectors';
import { RegexEdit } from '@/util/regex';
import { debugLog } from '../content/util';

export interface CustomPatterns {
	[connectorId: string]: string[];
}

export interface Properties {
	properties?: {
		userApiUrl: string;
		userToken: string;
	};
}

interface ListenBrainzAuthStarted extends Properties {
	isAuthStarted?: boolean;
}

interface ListenBrainzAuthFinished extends Properties {
	sessionID?: string;
	sessionName?: string;
}

export type ListenBrainzModel =
	| ListenBrainzAuthStarted
	| ListenBrainzAuthFinished;

export type WebhookModel = {
	arrayProperties?: {
		applicationName: string;
		userApiUrl: string;
	}[];
};

export type ArrayProperty = {
	applicationName: string;
	userApiUrl: string;
};

export type ArrayProperties = ArrayProperty[];

export interface ScrobblerModels {
	LastFM?: { token?: string } | { sessionID?: string; sessionName?: string };
	LibreFM?: { token?: string } | { sessionID?: string; sessionName?: string };
	ListenBrainz?: ListenBrainzModel;
	Maloja?: Properties;
	Webhook?: WebhookModel;
}

export interface ManagerTab {
	tabId: number;
	mode: ControllerModeStr;
	song: CloneableSong | null;
}

export interface StateManagement {
	activeTabs: ManagerTab[];
	browserPreferredTheme: 'light' | 'dark';
}

export interface DataModels extends ScrobblerModels {
	/* sync options */
	[CUSTOM_PATTERNS]: CustomPatterns;
	[OPTIONS]: GlobalOptions;
	[NOTIFICATIONS]: { authDisplayCount: number };
	[CONNECTORS_OPTIONS]: ConnectorOptions;
	[CONNECTORS_OVERRIDE_OPTIONS]: ConnectorsOverrideOptions;

	/* local options */
	[CORE]: { appVersion: string };
	[LOCAL_CACHE]: { [key: string]: SavedEdit };
	[REGEX_EDITS]: RegexEdit[];

	/* state management */
	[STATE_MANAGEMENT]: StateManagement;
	[DISABLED_TABS]: {
		[key: number]: {
			[key in (typeof connectors)[number]['id']]: true;
		};
	};
}

type StorageEvents = {
	updateLock: (toRun: number) => void;
};

const LOCKING_TIMEOUT = 3000;

/**
 * StorageArea wrapper that supports for namespaces.
 *
 * @typeParam K - Namespace key.
 */
export default class StorageWrapper<K extends keyof DataModels> {
	// V extends DataModels[K], T extends Record<K, V>
	private storage:
		| browser.Storage.SyncStorageAreaSync
		| browser.Storage.LocalStorageArea;
	private namespace: StorageNamespace;
	private requests: number[] = [];
	private autoIncrement = 0;
	private emitter = new EventEmitter<StorageEvents>();

	/**
	 * interval to ensure the locking doesnt get stuck permanently
	 */
	private interval = setInterval(() => {
		this.unlock();
	}, LOCKING_TIMEOUT);

	/**
	 * @param storage - StorageArea object
	 * @param namespace - Storage namespace
	 */
	constructor(
		storage:
			| browser.Storage.SyncStorageAreaSync
			| browser.Storage.LocalStorageArea,
		namespace: StorageNamespace,
	) {
		this.storage = storage;
		this.namespace = namespace;
	}

	unlock(): void {
		this.requests = this.requests.slice(1);
		this.emitter.emit('updateLock', this.requests[0]);

		clearInterval(this.interval);
		this.interval = setInterval(() => {
			this.unlock();
		}, LOCKING_TIMEOUT);
	}

	/**
	 * Read data from storage, don't respect locking
	 * @returns Storage data
	 */
	async get(): Promise<DataModels[K] | null> {
		// #v-ifdef VITE_DEV
		console.log('StorageWrapper#get: ', this.namespace);
		// #v-endif
		const data = await this.storage.get();
		if (data && this.namespace in data) {
			return data[this.namespace] as DataModels[K];
		}

		return null;
	}

	/**
	 * Read data from storage, respect locking
	 * @returns Storage data
	 */
	async getLocking(): Promise<DataModels[K] | null> {
		const ready = new Promise((resolve) => {
			const id = this.autoIncrement++;
			this.requests.push(id);
			if (this.requests[0] === id) {
				resolve(true);
				return;
			}

			const unlock = (toRun: number) => {
				if (toRun === id) {
					resolve(true);
					this.emitter.off('updateLock', unlock);
				}
			};
			this.emitter.on('updateLock', unlock);
		});
		await ready;

		return this.get();
	}

	/**
	 * Save data to storage, don't lock storage
	 * @param data - Data to save
	 */
	async set(data: DataModels[K]): Promise<void> {
		const dataToSave = {
			[this.namespace]: data,
		};

		await this.storage.set(dataToSave);
	}

	/**
	 * Save data to storage, and lock storage
	 * @param data - Data to save
	 */
	async setLocking(data: DataModels[K]): Promise<void> {
		try {
			await this.set(data);
		} catch (err) {
			debugLog(err, 'warn');
		}
		this.unlock();
	}

	/**
	 * Extend saved data by given one.
	 * @param data - Data to add
	 */
	async update(data: Partial<DataModels[K]>): Promise<void> {
		const storageData = await this.getLocking();
		const dataToSave = Object.assign(storageData ?? {}, data);

		// TODO: use default here instead of empty object to avoid this workaround
		await this.setLocking(dataToSave as DataModels[K]);
	}

	/**
	 * Log storage data to console output.
	 * @param hiddenKeys - Array of keys should be hidden
	 */
	/* istanbul ignore next */
	async debugLog(hiddenKeys: string[] = []): Promise<void> {
		const data = await this.get();

		const hideSensitiveDataFn = (key: string, value: DataModels[K]) => {
			if (hiddenKeys.includes(key)) {
				return hideObjectValue(value);
			}

			return value;
		};

		const text = JSON.stringify(data, hideSensitiveDataFn, 2);

		// #v-ifdef !VITE_TEST
		// dont log in content script
		if (location?.protocol === 'chrome-extension:') {
			debugLog(`storage.${this.namespace} = ${text}`, 'info');
		}
		// #v-endif
	}

	/**
	 * Clear storage.
	 */
	async clear(): Promise<void> {
		await this.storage.remove(this.namespace);
	}
}
