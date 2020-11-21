import MD5 from 'blueimp-md5';

import { ApiCallResult } from '@/background/scrobbler/api-call-result';
import {
	BaseScrobbler,
	ScrobblerStorage,
	Session,
} from '@/background/scrobbler/base-scrobbler';

import { hideStringInText, timeoutPromise } from '@/background/util/util';
import { createQueryString } from '@/common/util-browser';
import { SongInfo, LoveStatus } from '@/background/object/song';

export interface AudioScrobblerApiParams {
	[param: string]: string;
}

export interface AudioScrobblerImage {
	'#text': string;
	size: string;
}

export interface AudioScrobblerResponse {
	session?: {
		key: string;
		name: string;
	};
	token?: string;
	error?: boolean; // TODO fix
	scrobbles?: {
		'@attr': {
			accepted: string;
		};
	};
	track?: {
		name: string;
		url?: string;
		duration?: string;
		userplaycount: string;
		artist: {
			name: string;
			url?: string;
		};
		album?: {
			title: string;
			image?: AudioScrobblerImage[];
			mbid?: string;
			url?: string;
		};
		userloved?: '0' | '1';
	};
}

export interface AudioScrobblerStorage extends ScrobblerStorage {
	token?: string;
}

export abstract class AudioScrobbler extends BaseScrobbler {
	abstract getApiKey(): string;

	abstract getApiSecret(): string;

	abstract getApiUrl(): string;

	abstract getBaseAuthUrl(): string;

	/** @override */
	async getAuthUrl(): Promise<string> {
		/*
		 * Stores the new obtained token into storage so it will be traded for
		 * a new session when needed. Because of this it is necessary this
		 * method is called only when user is really going to approve the token
		 * and not sooner. Otherwise use of the token would result in
		 * an unauthorized request.
		 *
		 * See http://www.last.fm/api/show/auth.getToken
		 */

		const params = {
			method: 'auth.gettoken',
		};
		let token: string = null;
		const data = (await this.storage.get()) as AudioScrobblerStorage;

		try {
			const responseData = await this.sendRequest(
				{ method: 'GET' },
				params,
				{ signed: false }
			);
			token = responseData.token;
		} catch (err) {
			this.debugLog('Error acquiring a token', 'warn');

			throw new Error('Error acquiring a token');
		}

		data.token = token;

		// set token and reset session so we will grab a new one
		delete data.sessionID;
		delete data.sessionName;
		await this.storage.set(data);

		return `${this.getBaseAuthUrl()}?api_key=${this.getApiKey()}&token=${token}`;
	}

	/** @override */
	async getSession(): Promise<Session> {
		/*
		 * Load session data from storage. Get new session data if previously
		 * saved session data is missing.
		 *
		 * If there is a stored token it is preferably traded for a new session
		 * which is then returned.
		 */

		const data = (await this.storage.get()) as AudioScrobblerStorage;

		/*
		 * if we have a token it means it is fresh and we
		 * want to trade it for a new session ID
		 */
		const token = data.token || null;
		if (token !== null) {
			let session = this.createEmptySession();

			try {
				session = await this.tradeTokenForSession(token);
			} catch (err) {
				this.debugLog('Failed to trade token for session', 'warn');

				await this.signOut();
				throw this.makeApiCallResult(ApiCallResult.ERROR_AUTH);
			}

			data.sessionID = session.sessionID;
			data.sessionName = session.sessionName;
			delete data.token;
			await this.storage.set(data);

			return session;
		} else if (!data.sessionID) {
			throw this.makeApiCallResult(ApiCallResult.ERROR_AUTH);
		}

		return {
			sessionID: data.sessionID,
			sessionName: data.sessionName,
		};
	}

	/** @override */
	async isReadyForGrantAccess(): Promise<boolean> {
		const data = (await this.storage.get()) as AudioScrobblerStorage;
		return !!data.token;
	}

	/** @override */
	async sendNowPlaying(songInfo: SongInfo): Promise<ApiCallResult> {
		const { artist, track, album, albumArtist, duration } = songInfo;
		const { sessionID } = await this.getSession();
		const params: AudioScrobblerApiParams = {
			track,
			artist,
			method: 'track.updatenowplaying',
			sk: sessionID,
		};

		if (album) {
			params.album = album;
		}

		if (albumArtist) {
			params.albumArtist = albumArtist;
		}

		if (duration) {
			params.duration = duration.toString();
		}

		const response = await this.sendRequest({ method: 'POST' }, params);
		return this.processResponse(response);
	}

	/** @override */
	async scrobble(songInfo: SongInfo): Promise<ApiCallResult> {
		const { artist, track, album, albumArtist, timestamp } = songInfo;
		const { sessionID } = await this.getSession();
		const params: AudioScrobblerApiParams = {
			method: 'track.scrobble',
			'timestamp[0]': timestamp.toString(),
			'track[0]': track,
			'artist[0]': artist,
			sk: sessionID,
		};

		if (album) {
			params['album[0]'] = album;
		}

		if (albumArtist) {
			params['albumArtist[0]'] = albumArtist;
		}

		const response = await this.sendRequest({ method: 'POST' }, params);

		try {
			return this.processResponse(response);
		} catch (err) {
			const scrobbles = response.scrobbles;

			if (scrobbles) {
				const acceptedCount = scrobbles['@attr'].accepted;
				if (acceptedCount === '0') {
					return this.makeApiCallResult(ApiCallResult.ERROR_OTHER);
				}
			}
		}

		return this.makeApiCallResult(ApiCallResult.ERROR_OTHER);
	}

	/** @override */
	async toggleLove(
		songInfo: SongInfo,
		loveStatus: LoveStatus
	): Promise<ApiCallResult> {
		const { artist, track } = songInfo;
		const { sessionID } = await this.getSession();
		const params = {
			track,
			artist,
			method:
				loveStatus === LoveStatus.Loved ? 'track.love' : 'track.unlove',
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
	 * Make a call to API to trade token for session ID.
	 * Assume the token was authenticated by the user.
	 *
	 * @param token Token provided by scrobbler service
	 *
	 * @return Session data
	 */
	async tradeTokenForSession(token: string): Promise<Session> {
		const params: AudioScrobblerApiParams = {
			method: 'auth.getsession',
			token,
		};

		const response = await this.sendRequest({ method: 'GET' }, params);
		this.processResponse(response);

		const sessionName = response.session.name;
		const sessionID = response.session.key;

		return { sessionID, sessionName };
	}

	/**
	 * Execute asynchronous request.
	 *
	 * API key will be added to params by default and all parameters will be
	 * encoded for use in query string internally.
	 * @param options Fetch options
	 * @param params Object of key => value url parameters
	 * @param flags Flags
	 * @param [flags.signed=true] Should the request be signed
	 *
	 * @return Parsed response
	 */
	async sendRequest(
		options: RequestInit,
		params: AudioScrobblerApiParams,
		{ signed = true } = {}
	): Promise<AudioScrobblerResponse> {
		const url = this.makeRequestUrl(params, signed);

		const promise = fetch(url, options);
		const timeout = BaseScrobbler.REQUEST_TIMEOUT;

		let response: Response = null;
		let responseData: AudioScrobblerResponse = null;
		try {
			response = await timeoutPromise(timeout, promise);
			responseData = (await response.json()) as AudioScrobblerResponse;
		} catch {
			throw this.makeApiCallResult(ApiCallResult.ERROR_OTHER);
		}

		const responseStr = JSON.stringify(responseData, null, 2);
		const debugMsg = hideUserData(responseData, responseStr);

		if (!response.ok) {
			this.debugLog(`${params.method} response:\n${debugMsg}`, 'error');
			throw this.makeApiCallResult(ApiCallResult.ERROR_OTHER);
		}

		this.debugLog(`${params.method} response:\n${debugMsg}`);
		return responseData;
	}

	/**
	 * Create URL of API request based on API params.
	 *
	 * @param params Object of key => value url parameters
	 * @param signed Should the request be signed
	 *
	 * @return URL of API request
	 */
	makeRequestUrl(params: AudioScrobblerApiParams, signed: boolean): string {
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
	 *
	 * @param params Parameters of API method
	 *
	 * @return Signed parameters
	 */
	generateSign(params: AudioScrobblerApiParams): string {
		const keys = Object.keys(params).sort();
		let o = '';

		for (const key of keys) {
			if (['format', 'callback'].includes(key)) {
				continue;
			}

			o += key + params[key];
		}

		o += this.getApiSecret();

		return MD5(o);
	}

	/**
	 * Process response and return service call result.
	 *
	 * @param responseData Response data
	 *
	 * @return Response result
	 */
	processResponse(responseData: AudioScrobblerResponse): ApiCallResult {
		if (responseData.error) {
			throw this.makeApiCallResult(ApiCallResult.ERROR_OTHER);
		}

		return this.makeApiCallResult(ApiCallResult.RESULT_OK);
	}
}

/**
 * Hide sensitive user data from debug output.
 *
 * @param response Response data
 * @param text Debug message
 *
 * @return Text with hidden data
 */
function hideUserData(response: AudioScrobblerResponse, text: string) {
	let debugMsg = text;

	const sensitiveValues = [response.token];
	const session = response.session;
	if (session) {
		sensitiveValues.push(session.name);
		sensitiveValues.push(session.key);
	}

	for (const value of sensitiveValues) {
		debugMsg = hideStringInText(value, debugMsg);
	}

	return debugMsg;
}
