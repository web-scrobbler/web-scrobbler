import md5 from 'blueimp-md5';

import { Session } from '@/background/account/session';
import { LoveStatus } from '@/background/model/song/LoveStatus';
import { TrackInfo } from '@/background/model/song/TrackInfo';
import { ApiCallResult } from '@/background/scrobbler/api-call-result';
import {
	REQUEST_TIMEOUT,
	ScrobbleService,
} from '@/background/scrobbler/service/ScrobbleService';

import { hideStringInText, timeoutPromise } from '@/background/util/util';
import { createQueryString } from '@/common/util-browser';
import { AudioScrobblerAppInfo } from '@/background/scrobbler/service/audioscrobbler/AudioScrobblerData';

export interface AudioScrobblerApiParams {
	[param: string]: string;
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

export interface AudioScrobblerImage {
	'#text': string;
	size: string;
}

export class AudioScrobblerScrobbleService implements ScrobbleService {
	constructor(
		private session: Session,
		private appInfo: AudioScrobblerAppInfo
	) {}

	async sendNowPlayingRequest(trackInfo: TrackInfo): Promise<ApiCallResult> {
		const { artist, track, album, albumArtist, duration } = trackInfo;
		const { sessionId } = this.session;
		const params: AudioScrobblerApiParams = {
			track,
			artist,
			method: 'track.updatenowplaying',
			sk: sessionId,
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

	async sendScrobbleRequest(trackInfo: TrackInfo): Promise<ApiCallResult> {
		const { artist, track, album, albumArtist, timestamp } = trackInfo;
		const { sessionId } = this.session;
		const params: AudioScrobblerApiParams = {
			method: 'track.scrobble',
			'timestamp[0]': timestamp.toString(),
			'track[0]': track,
			'artist[0]': artist,
			sk: sessionId,
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
					return new ApiCallResult('error-other', 'id');
				}
			}
		}

		return new ApiCallResult('error-other', 'id');
	}

	async sendLoveRequest(
		trackInfo: TrackInfo,
		loveStatus: LoveStatus
	): Promise<ApiCallResult> {
		const { artist, track } = trackInfo;
		const { sessionId } = this.session;
		const params = {
			track,
			artist,
			method:
				loveStatus === LoveStatus.Loved ? 'track.love' : 'track.unlove',
			sk: sessionId,
		};

		const response = await this.sendRequest({ method: 'POST' }, params);
		return this.processResponse(response);
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
	private async sendRequest(
		options: RequestInit,
		params: AudioScrobblerApiParams,
		{ signed = true } = {}
	): Promise<AudioScrobblerResponse> {
		const url = this.makeRequestUrl(params, signed);

		const promise = fetch(url, options);
		const timeout = REQUEST_TIMEOUT;

		let response: Response = null;
		let responseData: AudioScrobblerResponse = null;
		try {
			response = await timeoutPromise(timeout, promise);
			responseData = (await response.json()) as AudioScrobblerResponse;
		} catch {
			throw new ApiCallResult('error-other', 'id');
		}

		const responseStr = JSON.stringify(responseData, null, 2);
		// const debugMsg = hideUserData(responseData, responseStr);

		if (!response.ok) {
			// this.debugLog(`${params.method} response:\n${debugMsg}`, 'error');
			throw new ApiCallResult('error-other', 'id');
		}

		// this.debugLog(`${params.method} response:\n${debugMsg}`);
		return responseData;
	}

	/**
	 * Process response and return service call result.
	 *
	 * @param responseData Response data
	 *
	 * @return Response result
	 */
	private processResponse(
		responseData: AudioScrobblerResponse
	): ApiCallResult {
		// FIXME Scrobbler ID
		if (responseData.error) {
			throw new ApiCallResult('error-other', 'id');
		}

		return new ApiCallResult('ok', 'id');
	}

	/**
	 * Create URL of API request based on API params.
	 *
	 * @param params Object of key => value url parameters
	 * @param signed Should the request be signed
	 *
	 * @return URL of API request
	 */
	private makeRequestUrl(
		params: AudioScrobblerApiParams,
		signed: boolean
	): string {
		params.api_key = this.appInfo.apiKey;
		params.format = 'json';

		if (signed) {
			params.api_sig = this.generateSign(params);
		}

		const queryStr = createQueryString(params);
		return `${this.appInfo.apiUrl}?${queryStr}`;
	}

	/**
	 * Compute string for signing request.
	 * See http://www.last.fm/api/authspec#8
	 *
	 * @param params Parameters of API method
	 *
	 * @return Signed parameters
	 */
	private generateSign(params: AudioScrobblerApiParams): string {
		const keys = Object.keys(params).sort();
		let o = '';

		for (const key of keys) {
			if (['format', 'callback'].includes(key)) {
				continue;
			}

			o += key + params[key];
		}

		o += this.appInfo.apiSecret;

		return md5(o);
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
