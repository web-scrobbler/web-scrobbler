'use strict';

define((require) => {
	const MD5 = require('blueimp-md5');
	const BaseScrobbler = require('scrobbler/base-scrobbler');
	const ServiceCallResult = require('object/service-call-result');

	const { hideStringInText, timeoutPromise } = require('util/util');
	const { createQueryString } = require('util/util-browser');

	class AudioScrobbler extends BaseScrobbler {
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
			 * a new session when needed. Because of this it is necessary this method
			 * is called only when user is really going to approve the token and
			 * not sooner. Otherwise use of the token would result in an unauthorized
			 * request.
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
					{ method: 'GET' }, params, { signed: false }
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
					throw ServiceCallResult.ERROR_AUTH;
				}

				data.sessionID = session.sessionID;
				data.sessionName = session.sessionName;
				delete data.token;
				await this.storage.set(data);

				return session;
			} else if (!data.sessionID) {
				throw ServiceCallResult.ERROR_AUTH;
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
		async sendNowPlaying(song) {
			const { sessionID } = await this.getSession();
			const params = {
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
				params.duration = song.getDuration();
			}

			const response = await this.sendRequest({ method: 'POST' }, params);
			return AudioScrobbler.processResponse(response);
		}

		/** @override */
		async scrobble(song) {
			const { sessionID } = await this.getSession();
			const params = {
				method: 'track.scrobble',
				'timestamp[0]': song.metadata.startTimestamp,
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

			const response = await this.sendRequest({ method: 'POST' }, params);

			const result = AudioScrobbler.processResponse(response);
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
		async toggleLove(song, isLoved) {
			const { sessionID } = await this.getSession();
			const params = {
				method: isLoved ? 'track.love' : 'track.unlove',
				track: song.getTrack(),
				artist: song.getArtist(),
				sk: sessionID,
			};

			const response = await this.sendRequest({ method: 'POST' }, params);
			return AudioScrobbler.processResponse(response);
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
		 * @return {Object} Session data
		 */
		async tradeTokenForSession(token) {
			const params = { method: 'auth.getsession', token };

			const response = await this.sendRequest({ method: 'GET' }, params);
			const result = AudioScrobbler.processResponse(response);
			if (result !== ServiceCallResult.RESULT_OK) {
				throw ServiceCallResult.ERROR_AUTH;
			}

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
		 * @param  {String} options Fetch options
		 * @param  {Object} params Object of key => value url parameters
		 * @param  {Boolean} signed Should the request be signed?
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
		 * Create URL of API request based on API params.
		 * @param  {Object} params Object of key => value url parameters
		 * @param  {Boolean} signed Should the request be signed?
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
		 * @param  {Object} params Parameters of API method
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
		 * @param  {Object} responseData Response data
		 * @return {Object} Response result
		 */
		static processResponse(responseData) {
			if (responseData.error) {
				return ServiceCallResult.ERROR_OTHER;
			}

			return ServiceCallResult.RESULT_OK;
		}
	}

	/**
	 * Hide sensitive user data from debug output.
	 * @param  {Object} response Response data
	 * @param  {String} text Debug message
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

	return AudioScrobbler;
});
