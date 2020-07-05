import MD5 from 'blueimp-md5';

import ApiCallResult from '@/background/object/api-call-result';
import BaseScrobbler from '@/background/scrobbler/base-scrobbler';

import { hideStringInText, timeoutPromise } from '@/background/util/util';
import { createQueryString } from '@/common/util-browser';

export default class AudioScrobbler extends BaseScrobbler {
	getApiKey() {
		throw new Error('This function must be overridden!');
	}

	getApiSecret() {
		throw new Error('This function must be overridden!');
	}

	getApiUrl() {
		throw new Error('This function must be overridden!');
	}

	getBaseAuthUrl() {
		throw new Error('This function must be overridden!');
	}

	/** @override */
	async getAuthUrl() {
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
		let token = null;
		const data = await this.storage.get();

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
	async getSession() {
		/*
		 * Load session data from storage. Get new session data if previously
		 * saved session data is missing.
		 *
		 * If there is a stored token it is preferably traded for a new session
		 * which is then returned.
		 */

		const data = await this.storage.get();

		/*
		 * if we have a token it means it is fresh and we
		 * want to trade it for a new session ID
		 */
		const token = data.token || null;
		if (token !== null) {
			let session = {};

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
	async isReadyForGrantAccess() {
		const data = await this.storage.get();
		return data.token;
	}

	/** @override */
	async sendNowPlaying(songInfo) {
		const { artist, track, album, albumArtist, duration } = songInfo;
		const { sessionID } = await this.getSession();
		const params = {
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
			params.duration = duration;
		}

		const response = await this.sendRequest({ method: 'POST' }, params);
		return this.processResponse(response);
	}

	/** @override */
	async scrobble(songInfo) {
		const { artist, track, album, albumArtist, timestamp } = songInfo;
		const { sessionID } = await this.getSession();
		const params = {
			method: 'track.scrobble',
			'timestamp[0]': timestamp,
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
	async toggleLove(songInfo, isLoved) {
		const { artist, track } = songInfo;
		const { sessionID } = await this.getSession();
		const params = {
			track,
			artist,
			method: isLoved ? 'track.love' : 'track.unlove',
			sk: sessionID,
		};

		const response = await this.sendRequest({ method: 'POST' }, params);
		return this.processResponse(response);
	}

	/** @override */
	canLoveSong() {
		return true;
	}

	/** Internal functions. */

	/**
	 * Make a call to API to trade token for session ID.
	 * Assume the token was authenticated by the user.
	 *
	 * @param {String} token Token provided by scrobbler service
	 *
	 * @return {Object} Session data
	 */
	async tradeTokenForSession(token) {
		const params = { method: 'auth.getsession', token };

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
	 *
	 * @param {String} options Fetch options
	 * @param {Object} params Object of key => value url parameters
	 * @param {Boolean} signed Should the request be signed
	 *
	 * @return {Object} Parsed response
	 */
	async sendRequest(options, params, { signed = true } = {}) {
		const url = this.makeRequestUrl(params, signed);

		const promise = fetch(url, options);
		const timeout = BaseScrobbler.REQUEST_TIMEOUT;

		let response = null;
		let responseData = null;
		try {
			response = await timeoutPromise(timeout, promise);
			responseData = await response.json();
		} catch (e) {
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
	 * @param {Object} params Object of key => value url parameters
	 * @param {Boolean} signed Should the request be signed
	 *
	 * @return {String} URL of API request
	 */
	makeRequestUrl(params, signed) {
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
	 * @param {Object} params Parameters of API method
	 *
	 * @return {String} Signed parameters
	 */
	generateSign(params) {
		const keys = Object.keys(params).sort();
		let o = '';

		for (const key of keys) {
			if (['format', 'callback'].includes(key)) {
				continue;
			}

			o += key + params[key];
		}

		return MD5(o + this.getApiSecret());
	}

	/**
	 * Process response and return service call result.
	 *
	 * @param {Object} responseData Response data
	 *
	 * @return {Object} Response result
	 */
	processResponse(responseData) {
		if (responseData.error) {
			throw this.makeApiCallResult(ApiCallResult.ERROR_OTHER);
		}

		return this.makeApiCallResult(ApiCallResult.RESULT_OK);
	}
}

/**
 * Hide sensitive user data from debug output.
 *
 * @param {Object} response Response data
 * @param {String} text Debug message
 *
 * @return {String} Text with hidden data
 */
function hideUserData(response, text) {
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
