import MD5 from 'blueimp-md5';

import { hideStringInText, timeoutPromise } from '@/util/util';
import { createQueryString } from '@/util/util-browser';
import BaseScrobbler, { SessionData } from '@/core/scrobbler/base-scrobbler';
import { ServiceCallResult } from '@/core/object/service-call-result';
import { BaseSong } from '@/core/object/song';
import {
	AudioScrobblerSessionResponse,
	AudioScrobblerTrackScrobbleResponse,
} from '@/core/scrobbler/audio-scrobbler/audio-scrobbler.types';

export interface AudioScrobblerSimpleOptions {
	[key: string]: string | undefined | null;
}

export interface AudioScrobblerParams extends AudioScrobblerSimpleOptions {
	method: string;
	sk?: string;
	username?: string;
}

interface AudioScrobblerScrobbleParams extends AudioScrobblerParams {
	[key: `timestamp[${number}]`]: string | null;
	[key: `track[${number}]`]: string | null | undefined;
	[key: `artist[${number}]`]: string | null | undefined;
	[key: `album[${number}]`]: string | null | undefined;
	[key: `albumArtist[${number}]`]: string | null | undefined;
}

export default abstract class AudioScrobbler extends BaseScrobbler<'LastFM'> {
	protected abstract getApiKey(): string;
	protected abstract getApiSecret(): string;
	protected abstract getApiUrl(): string;
	protected abstract getBaseAuthUrl(): string;

	/** @override */
	async getAuthUrl(): Promise<string> {
		/*
		 * Stores the new obtained token into storage so it will be traded for
		 * a new session when needed. Because of this it is necessary this method
		 * is called only when user is really going to approve the token and
		 * not sooner. Otherwise use of the token would result in an unauthorized
		 * request.
		 *
		 * See http://www.last.fm/api/show/auth.getToken
		 */

		const params: AudioScrobblerParams = {
			method: 'auth.gettoken',
		};

		let token: string | null = null;
		let data = await this.storage?.get();

		try {
			const responseData = await this.sendRequest<{ token: string }>(
				{ method: 'GET' },
				params,
				false
			);
			token = responseData.token;
		} catch (err) {
			this.debugLog('Error acquiring a token', 'warn');

			throw new Error('Error acquiring a token');
		}

		if (!data) {
			data = { token };
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access -- we need to set token even if not exists
		(data as any).token = token;

		// set token and reset session so we will grab a new one
		if ('sessionID' in data) {
			delete data.sessionID;
		}
		if ('sessionName' in data) {
			delete data.sessionName;
		}

		await this.storage.set(data);

		return `${this.getBaseAuthUrl()}?api_key=${this.getApiKey()}&token=${
			token || ''
		}`;
	}

	/** @override */
	async getSession(): Promise<SessionData> {
		/*
		 * Load session data from storage. Get new session data if previously
		 * saved session data is missing.
		 *
		 * If there is a stored token it is preferably traded for a new session
		 * which is then returned.
		 */

		const data = await this.storage.get();
		if (!data) {
			throw ServiceCallResult.ERROR_AUTH;
		}
		if (!('token' in data)) {
			if (!('sessionID' in data)) {
				throw ServiceCallResult.ERROR_AUTH;
			}
			return {
				sessionID: data.sessionID ?? 'undefined',
				sessionName: data.sessionName,
			};
		}

		/*
		 * if we have a token it means it is fresh and we
		 * want to trade it for a new session ID
		 */
		const token = data.token || null;

		if (token !== null) {
			try {
				const session = await this.tradeTokenForSession(token);

				delete data.token;

				/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access -- we need to set session even if not exists */
				(data as any).sessionID = session.sessionID;
				(data as any).sessionName = session.sessionName;
				/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */

				await this.storage.set(data);

				return session;
			} catch (err) {
				this.debugLog('Failed to trade token for session', 'warn');

				await this.signOut();
				throw ServiceCallResult.ERROR_AUTH;
			}
		}

		/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any -- we need to set session even if not exists */
		return {
			sessionID: (data as any).sessionID,
			sessionName: (data as any).sessionName,
		};
	}

	/** @override */
	async isReadyForGrantAccess(): Promise<boolean> {
		const data = await this.storage.get();
		if (!data || !('token' in data)) {
			return false;
		}
		return Boolean(data.token);
	}

	/** @override */
	async sendNowPlaying(song: BaseSong): Promise<ServiceCallResult> {
		const { sessionID } = await this.getSession();
		const params: AudioScrobblerParams = {
			method: 'track.updatenowplaying',
			track: song.getTrack(),
			artist: song.getArtist(),
			sk: sessionID,
		};

		if (song.getAlbum()) {
			params.album = song.getAlbum();
		}

		if (song.getAlbumArtist()) {
			params.albumArtist = song.getAlbumArtist();
		}

		if (song.getDuration()) {
			params.duration = `${song.getDuration() ?? ''}`;
		}

		const response = await this.sendRequest({ method: 'POST' }, params);

		return this.processResponse(response);
	}

	/** @override */
	async scrobble(song: BaseSong): Promise<ServiceCallResult> {
		const { sessionID } = await this.getSession();
		const params: AudioScrobblerScrobbleParams = {
			method: 'track.scrobble',
			'timestamp[0]': song.metadata.startTimestamp.toString(),
			'track[0]': song.getTrack(),
			'artist[0]': song.getArtist(),
			sk: sessionID,
		};

		if (song.getAlbum()) {
			params['album[0]'] = song.getAlbum();
		}

		if (song.getAlbumArtist()) {
			params['albumArtist[0]'] = song.getAlbumArtist();
		}

		const response =
			await this.sendRequest<AudioScrobblerTrackScrobbleResponse>(
				{ method: 'POST' },
				params
			);
		const result = this.processResponse(response);

		if (result === ServiceCallResult.RESULT_OK) {
			const scrobbles = response.scrobbles;

			if (scrobbles) {
				const acceptedCount = scrobbles['@attr'].accepted;

				if (acceptedCount === '0') {
					return ServiceCallResult.RESULT_IGNORE;
				}
			} else {
				return ServiceCallResult.ERROR_OTHER;
			}
		}

		return result;
	}

	/** @override */
	async toggleLove(
		song: BaseSong,
		isLoved: boolean
	): Promise<ServiceCallResult> {
		const { sessionID } = await this.getSession();
		const params = {
			method: isLoved ? 'track.love' : 'track.unlove',
			track: song.getTrack(),
			artist: song.getArtist(),
			sk: sessionID,
		};

		const response = await this.sendRequest({ method: 'POST' }, params);
		return this.processResponse(response);
	}

	/** @override */
	canLoveSong(): boolean {
		return true;
	}

	/** Internal functions. */

	/**
	 * Execute asynchronous request.
	 *
	 * API key will be added to params by default and all parameters will be
	 * encoded for use in query string internally.
	 *
	 * @param  options - Fetch options
	 * @param  params - Object of key =\> value url parameters
	 * @param  signed - Should the request be signed?
	 * @returns Parsed response
	 */

	protected async sendRequest<
		T extends Record<string, unknown> = Record<string, unknown>
	>(
		options: RequestInit,
		params: AudioScrobblerParams,
		signed = true
	): Promise<T> {
		const url = this.makeRequestUrl(params, signed);

		const promise = fetch(url, options);
		const timeout = this.REQUEST_TIMEOUT;

		let response = null;
		let responseData: T | null = null;
		try {
			response = await timeoutPromise(timeout, promise);
			responseData = (await response.json()) as T;
		} catch (e) {
			throw ServiceCallResult.ERROR_OTHER;
		}

		const responseStr = JSON.stringify(responseData, null, 2);
		const debugMsg = hideUserData(responseData, responseStr);

		if (!response.ok) {
			this.debugLog(`${params.method} response:\n${debugMsg}`, 'error');
			throw ServiceCallResult.ERROR_OTHER;
		}

		this.debugLog(`${params.method} response:\n${debugMsg}`);

		return responseData;
	}

	/**
	 * Make a call to API to trade token for session ID.
	 * Assume the token was authenticated by the user.
	 *
	 * @param token - Token provided by scrobbler service
	 * @returns Session data
	 */
	private async tradeTokenForSession(token: string): Promise<SessionData> {
		const params = { method: 'auth.getsession', token };

		const response = await this.sendRequest<AudioScrobblerSessionResponse>(
			{ method: 'GET' },
			params
		);

		const result = this.processResponse(response);

		if (result !== ServiceCallResult.RESULT_OK) {
			throw ServiceCallResult.ERROR_AUTH;
		}

		const sessionName = response.session.name;
		const sessionID = response.session.key;

		return { sessionID, sessionName };
	}

	/**
	 * Create URL of API request based on API params.
	 * @param params - Object of key =\> value url parameters
	 * @param signed - Should the request be signed?
	 * @returns URL of API request
	 */
	private makeRequestUrl(
		params: AudioScrobblerParams,
		signed: boolean
	): string {
		params.api_key = this.getApiKey();
		params.format = 'json';

		if (signed) {
			params.api_sig = this.generateSign(params);
		}

		const queryStr = createQueryString(params);
		return `${this.getApiUrl()}?${queryStr}`;
	}

	/**
	 * Compute string for signing request.
	 * See http://www.last.fm/api/authspec#8
	 * @param params - Parameters of API method
	 * @returns Signed parameters
	 */
	private generateSign(params: AudioScrobblerParams): string {
		const keys = Object.keys(params).sort();
		let o = '';

		for (const key of keys) {
			if (['format', 'callback'].includes(key)) {
				continue;
			}

			o += `${key}${params[key] || ''}`;
		}

		return MD5(o + this.getApiSecret());
	}

	/**
	 * Process response and return service call result.
	 * @param responseData - Response data
	 * @returns Response result
	 */
	protected processResponse(
		responseData: Record<string, unknown>
	): ServiceCallResult {
		if (responseData.error) {
			return ServiceCallResult.ERROR_OTHER;
		}

		return ServiceCallResult.RESULT_OK;
	}
}

/**
 * Hide sensitive user data from debug output.
 * @param response - Response data
 * @param text - Debug message
 * @returns Text with hidden data
 */
function hideUserData(response: Record<string, unknown>, text: string): string {
	let debugMsg = text;

	const sensitiveValues = [response.token];
	const session = response.session as
		| AudioScrobblerSessionResponse['session']
		| undefined;

	if (session) {
		sensitiveValues.push(session.name);
		sensitiveValues.push(session.key);
	}

	for (const value of sensitiveValues) {
		if (typeof value === 'string') {
			debugMsg = hideStringInText(value, debugMsg);
		} else if (typeof value === 'number') {
			debugMsg = hideStringInText(value.toString(), debugMsg);
		}
	}

	return debugMsg;
}
