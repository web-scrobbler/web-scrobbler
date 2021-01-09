/* eslint-disable @typescript-eslint/no-unused-vars */

import {
	ApiCallResult,
	ApiCallResultType,
} from '@/background/scrobbler/api-call-result';
import { BrowserStorage } from '@/background/storage/browser-storage';

import { debugLog, LogType } from '@/background/util/util';
import { SongInfo, SongMetadata, LoveStatus } from '@/background/object/song';
import { Storage } from '@/background/storage2/Storage';

export interface UserProperties {
	[prop: string]: string;
}

export interface ScrobblerSongInfo {
	songInfo: Partial<SongInfo>;
	metadata: Partial<SongMetadata>;
}

export interface Session {
	sessionID: string;
	sessionName: string;
}

export interface ScrobblerStorage {
	sessionID?: string;
	sessionName?: string;
	properties?: UserProperties;
}

/**
 * Base scrobbler object.
 *
 * Descendants of this object MUST return ApiCallResult object
 * as a result or as an error in functions that perform API calls.
 *
 * Each scrobbler has its storage which can contain session data and/or
 * other user data.
 *
 * Session data is an object with the following keys:
 *   @param {String} sessionID ID of a current session
 *   @param {String} sessionName a session name (username)
 *   @param {String} token a token that can be traded for a session ID
 *
 * Base scrobbler does not define how and when to write in the storage;
 * it depends on module implementation or/and service features.
 *
 * Basic implementation relies on session data stored in the storage as it
 * described above.
 */
export abstract class BaseScrobbler {
	protected storage: Storage<unknown>;

	/**
	 * Get timeout of all API requests in milliseconds.
	 */
	static readonly REQUEST_TIMEOUT = 15000;

	/**
	 * @constructor
	 */
	constructor() {
		this.initStorage();
		this.initUserProps();
	}

	/**
	 * Apply user properties.
	 *
	 * Each property is a property used internally in scrobblers.
	 * Users can edit custom properties in the extension settings.
	 *
	 * @param props Object contains user properties
	 */
	async applyUserProperties(props: UserProperties): Promise<void> {
		this.applyProps(props, this.getUsedDefinedProperties());

		const data = (await this.storage.get()) as ScrobblerStorage;
		if (!data.properties) {
			data.properties = {};
		}

		for (const prop in props) {
			const propValue = props[prop];
			if (propValue) {
				data.properties[prop] = propValue;
			} else {
				delete data.properties[prop];
			}
		}

		await this.storage.set(data);
	}

	/**
	 * Return a list of user-defined scrobbler properties.
	 *
	 * @return a list of user-defined scrobbler properties.
	 */
	getUsedDefinedProperties(): string[] {
		return [];
	}

	/** Authentication */

	/**
	 * Get auth URL where user should grant permission to the extension.
	 *
	 * @return Auth URL
	 */
	abstract async getAuthUrl(): Promise<string>;

	/**
	 * Get session data.
	 *
	 * @return Session data
	 */
	abstract async getSession(): Promise<Session>;

	/**
	 * Remove session info.
	 */
	async signOut(): Promise<void> {
		const data = (await this.storage.get()) as Session;

		delete data.sessionID;
		delete data.sessionName;

		await this.storage.set(data);
	}

	/**
	 * Check if the scrobbler is waiting until user grant access to
	 * scrobbler service.
	 *
	 * @return Check result
	 */
	abstract async isReadyForGrantAccess(): Promise<boolean>;

	/** API requests */

	/**
	 * Send a now playing request.
	 *
	 * @param songInfo Object containing song info
	 *
	 * @return Result
	 */
	abstract async sendNowPlaying(songInfo: SongInfo): Promise<ApiCallResult>;

	/**
	 * Send a scrobble request.
	 *
	 * @param songInfo Object containing song info
	 *
	 * @return Result
	 */
	abstract async scrobble(songInfo: SongInfo): Promise<ApiCallResult>;

	/**
	 * Send an (un)love request.
	 *
	 * @param songInfo Object containing song info
	 * @param loveStatus Flag means song should be loved or not
	 *
	 * @return Result
	 */
	abstract async toggleLove(
		songInfo: SongInfo,
		loveStatus: LoveStatus
	): Promise<ApiCallResult>;

	/**
	 * Get information about song.
	 *
	 * @param songInfo Song info object
	 *
	 * @return Song info from scrobble service.
	 */
	async getSongInfo(songInfo: SongInfo): Promise<ScrobblerSongInfo | null> {
		return Promise.resolve(null) as Promise<null>;
	}
	/* Getters. */

	/**
	 * Get base profile URL.
	 */
	abstract getBaseProfileUrl(): string;

	/**
	 * Get status page URL.
	 */
	abstract getStatusUrl(): string;

	/**
	 * Get the scrobbler ID. The ID must be unique.
	 */
	abstract getId(): string;

	/**
	 * Get the scrobbler label.
	 */
	abstract getLabel(): string;

	/**
	 * Get URL to profile page.
	 *
	 * @return Profile URL
	 */
	async getProfileUrl(): Promise<string> {
		const { sessionName } = await this.getSession();
		return `${this.getBaseProfileUrl()}${sessionName}`;
	}

	/**
	 * Get a storage namespace where the scrobbler data will be stored.
	 *
	 * @return Storage namespace name
	 */
	abstract getStorageName(): string;

	/** Scrobbler features. */

	/**
	 * Check if service supports loving songs.
	 *
	 * @return True if service supports that; false otherwise
	 */
	canLoveSong(): boolean {
		return false;
	}

	/**
	 * Check if service supports retrieving of song info.
	 *
	 * @return True if service supports that; false otherwise
	 */
	canLoadSongInfo(): boolean {
		return false;
	}

	/** Misc */

	/**
	 * Return a new ApiCallResult object with the scrobbler ID attached.
	 *
	 * @param resultType ApiCallResult type
	 *
	 * @return ApiCallResult object
	 */
	makeApiCallResult(resultType: ApiCallResultType): ApiCallResult {
		return new ApiCallResult(resultType, this.getId());
	}

	createEmptySession(): Session {
		return { sessionID: null, sessionName: null };
	}

	/**
	 * Helper function to show debug output.
	 *
	 * @param text Debug message
	 * @param [logType=log] Log type
	 */
	debugLog(text: string, logType: LogType = 'log'): void {
		const message = `${this.getLabel()}: ${text}`;
		debugLog(message, logType);
	}

	private initStorage(): void {
		const sensitiveProps = ['token', 'sessionID', 'sessionName'];
		sensitiveProps.push(...this.getUsedDefinedProperties());

		this.storage = BrowserStorage.getScrobblerStorage(
			this.getStorageName()
		);
		// this.storage.debugLog(sensitiveProps);
	}

	private async initUserProps(): Promise<void> {
		const { properties } = (await this.storage.get()) as ScrobblerStorage;
		for (const prop in properties) {
			this[prop] = properties[prop];
		}
	}

	private applyProps(props: UserProperties, allowedProps: string[]): void {
		for (const prop in props) {
			if (!allowedProps.includes(prop)) {
				throw new Error(`Unknown property: ${prop}`);
			}

			const propValue = props[prop];

			if (propValue === undefined) {
				throw new Error(`Property is not set: ${prop}`);
			}

			if (propValue) {
				this[prop] = props[prop];
			} else {
				delete this[prop];
			}
		}
	}
}
