'use strict';

define([
	'jquery',
	'vendor/md5',
	'objects/serviceCallResult',
	'storage/chromeStorage',
	'util'
], function ($, MD5, ServiceCallResult, ChromeStorage, Util) {
	const GET_AUTH_URL_TIMEOUT = 10000;

	/**
	 * List of scrobbler options.
	 * @type {Array}
	 */
	const SCROBBLER_OPTIONS = [
		/**
		 * Scrobbler label.
		 * @type {String}
		 */
		'label',
		/**
		 * Storage namespace in which scrobbler options are stored.
		 * @type {String}
		 */
		'storage',
		/**
		 * URL used to execute API methods.
		 * @type {String}
		 */
		'apiUrl',
		/**
		 * URL used to authenticate user.
		 * @type {String}
		 */
		'authUrl',
		/**
		 * URL used to view service status.
		 * @type {String}
		 */
		'statusUrl',
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

	/**
	 * Base scrobbler object.
	 *
	 * This object and its ancestors MUST return ServiceCallResult instance
	 * as result or error value in methods that execute API methods.
	 */
	class BaseScrobbler {
		/**
		 * @param {Object} options Scrobbler options
		 *
		 * @see {@link SCROBBLER_OPTIONS}
		 */
		constructor(options) {
			for (let option of SCROBBLER_OPTIONS) {
				this[option] = options[option];
			}

			this.storage = ChromeStorage.getLocalStorage(options.storage);
			this.storage.debugLog();
		}

		/**
		 * Fetch auth URL where user should grant permissions to our token.
		 *
		 * Stores the new obtained token into storage so it will be traded for
		 * a new session when needed. Because of this it is necessary this method
		 * is called only when user is really going to approve the token and
		 * not sooner. Otherwise use of the token would result in an unauthorized
		 * request.
		 *
		 * See http://www.last.fm/api/show/auth.getToken
		 *
		 * @return {Promise} Promise that will be resolved with the auth URL
		 */
		getAuthUrl() {
			let url = `${this.apiUrl}?method=auth.gettoken&api_key=${this.apiKey}`;
			return Util.timeoutPromise(GET_AUTH_URL_TIMEOUT, fetch(url, { method: 'GET' }).then((response) => {
				return response.text();
			}).then((text) => {
				let xml = $($.parseXML(text));
				let status = xml.find('lfm').attr('status');

				return this.storage.get().then((data) => {
					if (status !== 'ok') {
						console.log('Error acquiring a token: %s', text);

						data.token = null;
						return this.storage.set(data).then(() => {
							throw new Error('Error acquiring a token');
						});
					}

					// set token and reset session so we will grab a new one
					data.sessionID = null;
					data.token = xml.find('token').text();

					console.log(`getToken response: ${Util.hideStringInText(data.token, text)}`);

					let authUrl = `${this.authUrl}?api_key=${this.apiKey}&token=${data.token}`;
					return this.storage.set(data).then(() => {
						console.log(`AUth url: ${authUrl}`);
						return authUrl;
					});
				});
			}));
		}

		/**
		 * Remove session info.
	 	 * @return {Promise} Promise that will be resolved when the task has complete
		 */
		signOut() {
			return this.storage.get().then((data) => {
				// data.token = null;
				data.sessionID = null;
				data.sessionName = null;

				return this.storage.set(data);
			});
		}

		/**
		 * Get status page URL.
		 * @return {String} Status page URL
		 */
		getStatusUrl() {
			return this.statusUrl;
		}

		/**
		 * Get URL to profile page.
		 * @return {Promise} Promise that will be resolved with URL
		 */
		getProfileUrl() {
			return Promise.resolve(null);
		}

		/**
		 * Load session data from storage. Get new session data if previously
		 * saved session data is missing.
		 *
		 * If there is a stored token it is preferably traded for a new session
		 * which is then returned.
		 *
		 * @return {Promise} Promise that will be resolved with the session data
		 */
		getSession() {
			return this.storage.get().then((data) => {
				// if we have a token it means it is fresh and we
				// want to trade it for a new session ID
				var token = data.token || null;
				if (token !== null) {
					return this.tradeTokenForSession(token).then((session) => {
						// token is already used, reset it and store
						// the new session
						data.token = null;
						data.sessionID = session.sessionID;
						data.sessionName = session.sessionName;

						return this.storage.set(data).then(() => {
							return session;
						});
					}).catch(() => {
						console.warn(this.label + ' Failed to trade token for session - the token is probably not authorized');

						// both session and token are now invalid
						return this.signOut().then(() => {
							throw ServiceCallResult.AuthError();
						});
					});
				} else if (!data.sessionID) {
					throw ServiceCallResult.AuthError();
				} else {
					return {
						sessionID: data.sessionID,
						sessionName: data.sessionName
					};
				}
			});
		}

		/**
		 * Make a call to API to trade token for session ID.
		 * Assume the token was authenticated by the user.
		 *
		 * @param {String} token Token provided by scrobbler service
		 * @return {Promise} Promise that will be resolved with the session ID
		 */
		tradeTokenForSession(token) {
			let params = {
				method: 'auth.getsession',
				token: token
			};

			return this.doRequest('GET', params, true).then(($doc) => {
				let result = processResponse($doc);
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
			var keys = [];
			var o = '';

			for (var x in params) {
				if (params.hasOwnProperty(x)) {
					keys.push(x);
				}
			}

			// params has to be ordered alphabetically
			keys.sort();

			for (var i = 0; i < keys.length; i++) {
				if (keys[i] === 'format' || keys[i] === 'callback') {
					continue;
				}

				o = o + keys[i] + params[keys[i]];
			}

			// append secret
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
		doRequest(method, params, signed) {
			params.api_key = this.apiKey;

			if (signed) {
				params.api_sig = this.generateSign(params);
			}

			let queryStr = $.param(params);
			let url = `${this.apiUrl}?${queryStr}`;

			return fetch(url, { method }).then((response) => {
				return response.text();
			}).then((text) => {
				let $doc = $($.parseXML(text));
				let debugMsg = hideUserData($doc, text);
				console.log(`${this.label}: ${params.method} response:\n${debugMsg}`);

				return $doc;
			}).catch(() => {
				throw ServiceCallResult.OtherError();
			});
		}

		/**
		 * Asynchronously load song info into given song object.
		 *
		 * @param  {Song} song Song instance
		 * @return {Promise} Promise that will be resolved with 'isValid' flag
		 */
		loadSongInfo() {
			return Promise.resolve(false);
		}

		/**
		 * Check if service supports retrieving of song info.
		 * @return {Boolean} True if service supports that; false otherwise
		 */
		isLoadSongInfoSupported() {
			return false;
		}

		/**
		 * Send current song as 'now playing' to API.
		 * @param  {Object} song Song instance
		 * @return {Promise} Promise that will be resolved with ServiceCallResult object
		 */
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

				console.log(`${this.label} sendNowPlaying()`);

				return this.doRequest('POST', params, true).then(processResponse);
			});
		}

		/**
		 * Send song to API to scrobble.
		 * @param  {Object} song Song instance
		 * @return {Promise} Promise that will be resolved with ServiceCallResult object
		 */
		scrobble(song) {
			return this.getSession().then(({ sessionID }) => {
				let params = {
					method: 'track.scrobble',
					'timestamp[0]': song.metadata.startTimestamp,
					'track[0]': song.processed.track || song.parsed.track,
					'artist[0]': song.processed.artist || song.parsed.artist,
					api_key: this.apiKey,
					sk: sessionID
				};

				if (song.getAlbum()) {
					params['album[0]'] = song.getAlbum();
				}

				console.log(this.label + ' scrobble()');

				return this.doRequest('POST', params, true).then(processResponse);
			});
		}

		/**
		 * Love or unlove given song.
		 * @param  {Object} song Song instance
		 * @param  {Boolean} isLoved Flag means song should be loved or not
		 * @return {Promise} Promise that will be resolved with ServiceCallResult object
		 */
		toggleLove(song, isLoved) {
			return this.getSession().then(({ sessionID }) => {
				let params = {
					method: 'track.' + (isLoved ? 'love' : 'unlove'),
					'track': song.processed.track || song.parsed.track,
					'artist': song.processed.artist || song.parsed.artist,
					api_key: this.apiKey,
					sk: sessionID
				};

				return this.doRequest('POST', params, true).then(processResponse);
			});
		}

		/**
		 * Get the scrobbler label.
		 * @return {string} Scrobbler label
		 */
		getLabel() {
			return this.label;
		}
	}

	function hideUserData($doc, text) {
		let sessionId = $doc.find('session > key').text();
		let token = $doc.find('token').text();

		let debugMsg = text;
		debugMsg = Util.hideStringInText(token, debugMsg);
		debugMsg = Util.hideStringInText(sessionId, debugMsg);

		return debugMsg;
	}

	/**
	 * Process response and return service call result.
	 * @param  {Object} $doc Response that parsed by jQuery
	 * @return {ServiceCallResult} Response result
	 */
	function processResponse($doc) {
		if ($doc.find('lfm').attr('status') !== 'ok') {
			// request passed but returned error
			return ServiceCallResult.OtherError();
		}

		return ServiceCallResult.Ok();
	}

	return BaseScrobbler;
});
