'use strict';

define((require) => {
	const $ = require('jquery');
	const MD5 = require('vendor/md5');
	const Util = require('util');
	const BaseScrobbler = require('scrobbler/base');
	const ServiceCallResult = require('object/service-call-result');

	const AUDIOSCROBBLER_OPTIONS = [
		/**
		 * Service API key.
		 * @type {String}
		 */
		'apiKey',
		/**
		 * Service API secret.
		 * @type {String}
		 */
		'apiSecret'
	];

	class AudioScrobbler extends BaseScrobbler {
		/** @override */
		constructor(options) {
			super(options);

			for (let option of AUDIOSCROBBLER_OPTIONS) {
				this[option] = options[option];
			}
		}

		/** @override */
		getAuthUrl() {
			/* Stores the new obtained token into storage so it will be traded for
			 * a new session when needed. Because of this it is necessary this method
			 * is called only when user is really going to approve the token and
			 * not sooner. Otherwise use of the token would result in an unauthorized
			 * request.
			 *
			 * See http://www.last.fm/api/show/auth.getToken
			 */

			let params = {
				method: 'auth.gettoken',
			};
			return this.sendRequest('GET', params, false).then(($doc) => {
				return this.storage.get().then((data) => {
					// set token and reset session so we will grab a new one
					delete data.sessionID;
					delete data.sessionName;
					data.token = $doc.find('token').text();

					let authUrl = `${this.authUrl}?api_key=${this.apiKey}&token=${data.token}`;
					return this.storage.set(data).then(() => {
						this.debugLog(`Auth url: ${authUrl}`);
						return authUrl;
					});
				});
			}).catch(() => {
				this.debugLog('Error acquiring a token', 'warn');

				return this.storage.get().then((data) => {
					delete data.token;
					return this.storage.set(data);
				}).then(() => {
					throw new Error('Error acquiring a token');
				});
			});
		}

		/** @override */
		getSession() {
			/* Load session data from storage. Get new session data if previously
			 * saved session data is missing.
			 *
			 * If there is a stored token it is preferably traded for a new session
			 * which is then returned.
			 */

			return this.storage.get().then((data) => {
				// if we have a token it means it is fresh and we
				// want to trade it for a new session ID
				let token = data.token || null;
				if (token !== null) {
					return this.tradeTokenForSession(token).then((session) => {
						return this.storage.set(session).then(() => {
							return session;
						});
					}).catch(() => {
						this.debugLog('Failed to trade token for session', 'warn');

						// both session and token are now invalid
						return this.signOut().then(() => {
							throw new ServiceCallResult(ServiceCallResult.ERROR_AUTH);
						});
					});
				} else if (!data.sessionID) {
					throw new ServiceCallResult(ServiceCallResult.ERROR_AUTH);
				} else {
					return {
						sessionID: data.sessionID,
						sessionName: data.sessionName
					};
				}
			});
		}

		/** @override */
		isReadyForGrantAccess() {
			return this.storage.get().then((data) => {
				return data.token;
			});
		}

		/** @override */
		sendNowPlaying(song) {
			return this.getSession().then(({ sessionID }) => {
				let params = {
					method: 'track.updatenowplaying',
					track: song.getTrack(),
					artist: song.getArtist(),
					api_key: this.apiKey,
					sk: sessionID
				};

				if (song.getAlbum()) {
					params.album = song.getAlbum();
				}
				if (song.getDuration()) {
					params.duration = song.getDuration();
				}

				return this.sendRequest('POST', params, true)
					.then(AudioScrobbler.processResponse);
			});
		}

		/** @override */
		scrobble(song) {
			return this.getSession().then(({ sessionID }) => {
				let params = {
					method: 'track.scrobble',
					'timestamp[0]': song.metadata.startTimestamp,
					'track[0]': song.getTrack(),
					'artist[0]': song.getArtist(),
					sk: sessionID
				};

				if (song.getAlbum()) {
					params['album[0]'] = song.getAlbum();
				}

				return this.sendRequest('POST', params, true)
					.then(AudioScrobbler.processResponse);
			});
		}

		/** @override */
		toggleLove(song, isLoved) {
			return this.getSession().then(({ sessionID }) => {
				let params = {
					method: isLoved ? 'track.love' : 'track.unlove',
					track: song.getTrack(),
					artist: song.getArtist(),
					sk: sessionID
				};

				return this.sendRequest('POST', params, true)
					.then(AudioScrobbler.processResponse);
			});
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
		 * @return {Promise} Promise that will be resolved with the session ID
		 */
		tradeTokenForSession(token) {
			let params = { method: 'auth.getsession', token };

			return this.sendRequest('GET', params, true).then(($doc) => {
				let result = AudioScrobbler.processResponse($doc);
				if (!result.isOk()) {
					throw new ServiceCallResult(ServiceCallResult.ERROR_AUTH);
				}

				let sessionName = $doc.find('session > name').text();
				let sessionID = $doc.find('session > key').text();

				return { sessionID, sessionName };
			});
		}

		/**
		 * Compute string for signing request.
		 * See http://www.last.fm/api/authspec#8
		 * @param  {Object} params Parameters of API method
		 * @return {String} Signed parameters
		 */
		generateSign(params) {
			let keys = Object.keys(params).sort();
			let o = '';

			for (let key of keys) {
				if (['format', 'callback'].includes(key)) {
					continue;
				}

				o += key + params[key];
			}

			return MD5(o + this.apiSecret);
		}

		/**
		 * Execute asynchronous request.
		 *
		 * API key will be added to params by default and all parameters will be
		 * encoded for use in query string internally.
		 *
		 * @param  {String} method Used method (GET or POST)
		 * @param  {Object} params Object of key => value url parameters
		 * @param  {Boolean} signed Should the request be signed?
		 * @return {Promise} Promise that will be resolved with parsed response
		 */
		sendRequest(method, params, signed) {
			params.api_key = this.apiKey;

			if (signed) {
				params.api_sig = this.generateSign(params);
			}

			let queryStr = $.param(params);
			let url = `${this.apiUrl}?${queryStr}`;

			let promise = fetch(url, { method }).then((response) => {
				return response.text().then((text) => {
					let $doc = $($.parseXML(text));
					let debugMsg = hideUserData($doc, text);

					if (!response.ok) {
						this.debugLog(`${params.method} response:\n${debugMsg}`, 'error');
						throw new ServiceCallResult(ServiceCallResult.ERROR_OTHER);
					}

					this.debugLog(`${params.method} response:\n${debugMsg}`);
					return $doc;
				});
			}).catch(() => {
				throw new ServiceCallResult(ServiceCallResult.ERROR_OTHER);
			});

			let timeout = BaseScrobbler.REQUEST_TIMEOUT;
			return Util.timeoutPromise(timeout, promise).catch(() => {
				throw new ServiceCallResult(ServiceCallResult.ERROR_OTHER);
			});
		}

		/**
		 * Process response and return service call result.
		 * @param  {Object} $doc Response that parsed by jQuery
		 * @return {ServiceCallResult} Response result
		 */
		static processResponse($doc) {
			if ($doc.find('lfm').attr('status') !== 'ok') {
				// request passed but returned error
				return new ServiceCallResult(ServiceCallResult.ERROR_OTHER);
			}

			let acceptedCounter = $doc.find('scrobbles').attr('accepted');
			if (acceptedCounter && acceptedCounter === '0') {
				// The song is ignored by service.
				return new ServiceCallResult(ServiceCallResult.IGNORED);
			}

			return new ServiceCallResult(ServiceCallResult.OK);
		}
	}

	/**
	 * Hide sensitive user data from debug output.
	 * @param  {Object} $doc Response that parsed by jQuery
	 * @param  {String} text Debug message
	 * @return {String} Text with hidden data
	 */
	function hideUserData($doc, text) {
		let sessionId = $doc.find('session > key').text();
		let token = $doc.find('token').text();

		let debugMsg = text;
		debugMsg = Util.hideStringInText(token, debugMsg);
		debugMsg = Util.hideStringInText(sessionId, debugMsg);

		return debugMsg;
	}

	return AudioScrobbler;
});
