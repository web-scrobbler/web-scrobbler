'use strict';

import { DebugLogType, debugLog } from '@/util/util';
import { BaseSong } from '@/core/object/song';
import { ServiceCallResult } from '@/core/object/service-call-result';
import StorageWrapper, {
	ArrayProperties,
	ArrayProperty,
	ScrobblerModels,
} from '@/core/storage/wrapper';
import {
	StorageNamespace,
	getScrobblerStorage,
} from '../storage/browser-storage';
import ClonedSong from '../object/cloned-song';
import {
	backgroundListener,
	setupBackgroundListeners,
} from '@/util/communication';

export interface SessionData {
	/** ID of a current session */
	sessionID: string;
	/** A session name (username) */
	sessionName?: string;
	/** A token that can be traded for a session ID */
	token?: string;
}

export interface ScrobblerSongInfo {
	artist: string;
	artistUrl: string;

	track: string;
	trackUrl: string;
	trackArtUrl?: string;

	album?: string;
	albumUrl?: string;
	albumMbId?: string;

	userloved?: boolean;
	userPlayCount: number;

	duration: number | null;
}

/**
 * Base scrobbler object.
 *
 * Descendants of this object MUST return ServiceCallResult constants
 * as result or error value in functions that perform API calls.
 *
 * Each scrobbler has its storage which can contain session data and/or
 * other user data.
 *
 *
 * Base scrobbler does not define how and when to write in the storage;
 * it depends on module implementation or/and service features.
 *
 * Basic implementation relies on session data stored in the storage as it
 * described above.
 */
export default abstract class BaseScrobbler<K extends keyof ScrobblerModels> {
	protected storage: StorageWrapper<K>;
	public userApiUrl: string | null = null;
	public userToken: string | null = null;
	public arrayProperties: ArrayProperties | null = null;
	abstract isLocalOnly: boolean;

	constructor() {
		this.storage = this.initStorage();
		void this.initUserProps();
		setupBackgroundListeners(
			backgroundListener({
				type: 'updateScrobblerProperties',
				fn: () => {
					void this.initUserProps();
				},
			}),
		);
	}

	/**
	 * Get user property values.
	 *
	 * Each property is a property used internally in scrobblers.
	 * Users can edit custom properties in the extension settings.
	 */
	public async getUserProperties(): Promise<
		| Record<string, never>
		| {
				userApiUrl: string;
				userToken: string;
		  }
	> {
		const storage = await this.storage.get();
		// @ts-ignore typescript is being weird and inconsistent about this line.
		if (!storage || !('properties' in storage) || !storage.properties) {
			return {} as Record<string, never>;
		}
		return storage.properties;
	}

	/**
	 * Apply user properties.
	 *
	 * Each property is a property used internally in scrobblers.
	 * Users can edit custom properties in the extension settings.
	 *
	 * @param props - Object contains user properties
	 */
	public async applyUserProperties(
		props: Record<string, unknown>,
	): Promise<void> {
		this.applyProps(props, this.getUserDefinedProperties());

		let data = await this.storage.get();

		if (!data) {
			data = {};
		}
		// this is weird we're just helping typescript out
		if (!data) {
			debugLog('No data in storage', 'error');
			return;
		}

		// @ts-ignore typescript is being weird and inconsistent about this line.
		if (!('properties' in data) || data.properties === undefined) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access -- Need to set properties even if undefined here
			(data as any).properties = {};
		}

		// this is weird we're just helping typescript out
		// @ts-ignore typescript is being weird and inconsistent about this line.
		if (!('properties' in data) || data.properties === undefined) {
			debugLog('No properties in storage', 'error');
			return;
		}

		for (const prop in props) {
			const propValue = props[prop];

			if (propValue) {
				// @ts-expect-error properties is not in the definition for all models, but we added it.
				data.properties[prop] = propValue;
			} else if (prop in data.properties) {
				// @ts-expect-error properties is not in the definition for all models, but we added it.
				delete data.properties[prop];
			}
		}

		await this.storage.set(data);
	}

	/**
	 * Return a list of user-defined scrobbler properties.
	 *
	 * @returns a list of user-defined scrobbler properties.
	 */
	public getUserDefinedProperties(): string[] {
		return [];
	}

	/**
	 * Return a list of user-defined scrobbler array properties.
	 *
	 * @returns a list of user-defined scrobbler array properties.
	 */
	public getUserDefinedArrayProperties(): string[] {
		return [];
	}

	/**
	 * Get array property values
	 *
	 * Each property is a property used internally in scrobblers.
	 * Users can add and remove custom array properties in the extension settings.
	 */
	public async getArrayProperties(): Promise<
		{
			applicationName: string;
			userApiUrl: string;
		}[]
	> {
		const storage = await this.storage.get();
		// @ts-ignore typescript is being weird and inconsistent about this line.
		if (
			!storage ||
			!('arrayProperties' in storage) ||
			!storage.arrayProperties
		) {
			return [];
		}
		return storage.arrayProperties;
	}

	/**
	 * Add array property values
	 *
	 * Each property is a property used internally in scrobblers.
	 * Users can add and remove custom array properties in the extension settings.
	 *
	 * @param props - The properties to add to the array.
	 */
	public async addUserArrayProperties(props: ArrayProperty) {
		let data = await this.storage.get();

		if (!data || !('arrayProperties' in data) || !data.arrayProperties) {
			data = {
				arrayProperties: [],
			};
		}
		// this is weird we're just helping typescript out
		if (!data || !('arrayProperties' in data) || !data.arrayProperties) {
			debugLog('No data in storage', 'error');
			return;
		}

		data.arrayProperties.push(props);
		this.applyArrayProps(
			data.arrayProperties,
			this.getUserDefinedArrayProperties(),
		);
		await this.storage.set(data);
	}

	/**
	 * Apply array property values
	 *
	 * Replaces the property array with the one supplied in parameters.
	 *
	 * @param props - property values to apply
	 */
	public async applyUserArrayProperties(props: ArrayProperty[]) {
		let data = await this.storage.get();

		if (!data || !('arrayProperties' in data) || !data.arrayProperties) {
			data = {
				arrayProperties: [],
			};
		}
		// this is weird we're just helping typescript out
		if (!data || !('arrayProperties' in data) || !data.arrayProperties) {
			debugLog('No data in storage', 'error');
			return;
		}

		data.arrayProperties = props;
		this.applyArrayProps(
			data.arrayProperties,
			this.getUserDefinedArrayProperties(),
		);
		await this.storage.set(data);
	}

	/** Authentication */

	/**
	 * Get auth URL where user should grant permission to the extension.
	 * Implementation must return an auth URL.
	 */
	public abstract getAuthUrl(): Promise<string>;

	/**
	 * Get session data.
	 * Implementation must return a session data.
	 */
	public abstract getSession(): Promise<SessionData>;

	/**
	 * Remove session info.
	 */
	public async signOut(): Promise<void> {
		const data = await this.storage.get();
		if (!data) {
			debugLog('No data in storage', 'error');
			return;
		}

		if ('sessionID' in data) {
			delete data.sessionID;
		}
		if ('sessionName' in data) {
			delete data.sessionName;
		}
		if ('arrayProperties' in data) {
			delete data.arrayProperties;
		}

		await this.storage.set(data);
	}

	/**
	 * Check if the scrobbler is waiting until user grant access to
	 * scrobbler service.
	 * Implementation must return a check result as a boolean value.
	 */
	public abstract isReadyForGrantAccess(): Promise<boolean>;

	/** API requests */

	/**
	 * Send current song as 'now playing' to API.
	 * Implementation must return ServiceCallResult constant.
	 *
	 * @param song - Song instance
	 */
	// eslint-disable-next-line no-unused-vars
	public abstract sendNowPlaying(song: BaseSong): Promise<ServiceCallResult>;

	/**
	 * Send resumed playing status of song to API.
	 * Implementation must return ServiceCallResult constant.
	 *
	 * @param song - Song instance
	 */
	// eslint-disable-next-line no-unused-vars
	public abstract sendResumedPlaying(
		song: BaseSong,
	): Promise<ServiceCallResult>;

	/**
	 * Send paused status of song to API.
	 * Implementation must return ServiceCallResult constant.
	 *
	 * @param song - Song instance
	 */
	// eslint-disable-next-line no-unused-vars
	public abstract sendPaused(song: BaseSong): Promise<ServiceCallResult>;

	/**
	 * Send song to API to scrobble.
	 * Implementation must return ServiceCallResult constant.
	 *
	 * @param song - Song instance
	 */
	// eslint-disable-next-line no-unused-vars
	public abstract scrobble(song: BaseSong): Promise<ServiceCallResult>;

	/**
	 * Love or unlove given song.
	 * Implementation must return ServiceCallResult constant.
	 *
	 * @param song - Song instance
	 * @param isLoved - Flag means song should be loved or not
	 */
	// eslint-disable-next-line no-unused-vars
	public abstract toggleLove(
		song: ClonedSong,
		isLoved: boolean,
	): Promise<ServiceCallResult | Record<string, never>>;

	/**
	 * Get song info.
	 * Implementation must return object contains a song data.
	 *
	 * @param song - Song instance
	 */
	// eslint-disable-next-line no-unused-vars
	public abstract getSongInfo(
		song: BaseSong,
	): Promise<ScrobblerSongInfo | Record<string, never>>;

	/* Getters. */

	/**
	 * Get status page URL.
	 */
	public abstract getStatusUrl(): string;

	/**
	 * Get the scrobbler label.
	 */
	public abstract getLabel():
		| 'Last.fm'
		| 'ListenBrainz'
		| 'Maloja'
		| 'Libre.fm'
		| 'Webhook'
		| 'Pleroma';

	/**
	 * Get URL to profile page.
	 * @returns Profile URL
	 */
	public async getProfileUrl(): Promise<string> {
		const { sessionName } = await this.getSession();
		return `${this.getBaseProfileUrl()}${sessionName ?? 'undefined'}`;
	}

	/**
	 * Get a storage namespace where the scrobbler data will be stored.
	 */
	protected abstract getStorageName(): StorageNamespace;

	/**
	 * Get base profile URL.
	 */
	protected abstract getBaseProfileUrl(): string;

	/** Scrobbler features. */

	/**
	 * Check if service supports loving songs.
	 * @returns True if service supports that; false otherwise
	 */
	public canLoveSong(): boolean {
		return false;
	}

	/**
	 * Check if service supports retrieving of song info.
	 * @returns True if service supports that; false otherwise
	 */
	public canLoadSongInfo(): boolean {
		return false;
	}

	/**
	 * Apply filters over song object. Override if scrobbler requires custom global filtering.
	 *
	 * @param song - the song about to be dispatched
	 * @returns updated song
	 */
	public applyFilter(song: BaseSong): BaseSong {
		return song;
	}

	/** Constants */

	/**
	 * Get timeout of all API requests in milliseconds.
	 */
	protected get REQUEST_TIMEOUT(): number {
		return 15_000;
	}

	/** Misc */

	/**
	 * Helper function to show debug output.
	 * @param text - Debug message
	 * @param logType - Log type
	 */
	protected debugLog(text: string, logType: DebugLogType = 'log'): void {
		const message = `${this.getLabel()}: ${text}`;
		debugLog(message, logType);
	}

	/** Internal functions */

	private initStorage() {
		const sensitiveProps = ['token', 'sessionID', 'sessionName'];
		sensitiveProps.push(...this.getUserDefinedProperties());

		const storage = getScrobblerStorage<K>(this.getStorageName());

		void storage.debugLog(sensitiveProps);

		return storage;
	}

	private async initUserProps() {
		const storageContent = await this.storage.get();
		// @ts-ignore typescript is being weird and inconsistent about this line.
		if (storageContent && 'properties' in storageContent) {
			for (const prop in storageContent.properties) {
				// this is a little cursed, but lets the TS compiler know what's going on
				if (
					prop === 'userApiUrl' &&
					'userApiUrl' in storageContent.properties
				) {
					this.userApiUrl = storageContent.properties.userApiUrl;
				}
				if (
					prop === 'userToken' &&
					'userToken' in storageContent.properties
				) {
					this.userToken = storageContent.properties.userToken;
				}
			}
		}
		if (storageContent && 'arrayProperties' in storageContent) {
			this.arrayProperties = storageContent.arrayProperties ?? [];
		}
	}

	private applyProps(
		props: Record<string, unknown>,
		allowedProps: string[],
	): void {
		for (const prop in props) {
			if (!allowedProps.includes(prop)) {
				throw new Error(`Unknown property: ${prop}`);
			}

			const propValue = props[prop];

			if (propValue === undefined) {
				throw new Error(`Property is not set: ${prop}`);
			}

			if (propValue && prop in this) {
				// @ts-expect-error This has already been checked for above, TS is just too stupid.
				this[prop] = props[prop];
			} else if (prop in this) {
				// @ts-expect-error This has already been checked for above, TS is just too stupid.
				delete this[prop];
			}
		}
	}

	private applyArrayProps(
		props: ArrayProperties,
		allowedProps: string[],
	): void {
		if (!props) {
			throw new Error('No props passed to applyArrayProps()');
		}
		if (props.length === 0) {
			this.arrayProperties = [];
			return;
		}
		for (const properties of props) {
			for (const [key, value] of Object.entries(properties)) {
				if (!allowedProps.includes(key)) {
					throw new Error(`Unknown property: ${key}`);
				}

				if (value === undefined) {
					throw new Error(`Property is not set: ${key}`);
				}
			}
		}
		this.arrayProperties = props;
	}
}
