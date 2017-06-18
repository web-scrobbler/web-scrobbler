'use strict';

define([
	'jquery',
	'vendor/md5',
	'objects/serviceCallResult',
	'storage/chromeStorage',
	'util',
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

	const options = ChromeStorage.getStorage(ChromeStorage.OPTIONS);

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

			this.storage = ChromeStorage.getScrobblerStorage(options.storage);
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
			let params = {
				method: 'auth.gettoken',
			};
			let requestPromise = this.doRequest('GET', params, false).then(($doc) => {
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
					return this.storage.set(data).then(() => {
						throw new Error('Error acquiring a token');
					});
				});
			});

			return Util.timeoutPromise(GET_AUTH_URL_TIMEOUT, requestPromise);
		}

		/**
		 * Remove session info.
	 	 * @return {Promise} Promise that will be resolved when the task has complete
		 */
		signOut() {
			return this.storage.get().then((data) => {
				// data.token = null;
				delete data.sessionID;
				delete data.sessionName;

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
						delete data.token;
						data.sessionID = session.sessionID;
						data.sessionName = session.sessionName;

						return this.storage.set(data).then(() => {
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

		/**
		 * Make a call to API to trade token for session ID.
		 * Assume the token was authenticated by the user.
		 *
		 * @param {String} token Token provided by scrobbler service
		 * @return {Promise} Promise that will be resolved with the session ID
		 */
		tradeTokenForSession(token) {
			let params = { method: 'auth.getsession', token };

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
		 * Check if the scrobbler is waiting until user grant access to
		 * scrobbler service (means the token is in Chrome storage).
		 * @return {Boolean} Check result
		 */
		isReadyForGrantAccess() {
			return this.storage.get().then((data) => {
				return data.token;
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
				if (!response.ok) {
					throw new ServiceCallResult(ServiceCallResult.ERROR_OTHER);
				}
				return response.text();
			}).then((text) => {
				let $doc = $($.parseXML(text));
				let debugMsg = hideUserData($doc, text);
				this.debugLog(`${params.method} response:\n${debugMsg}`);

				return $doc;
			}).catch(() => {
				throw new ServiceCallResult(ServiceCallResult.ERROR_OTHER);
			});
		}

		/**
		 * Asynchronously loads song info into given song object.
		 *
		 * @param  {Song} song Song instance
		 * @return {Promise} Promise that will resolve with 'isValid' flag
		 */
		getSongInfo(song) {
			if (!this.isSongInfoLoadingSupported()) {
				return Promise.resolve(true);
			}

			return this.getSession().then(({ sessionName }) => {
				return { username: sessionName };
			}).catch(() => {
				return {};
			}).then((params) => {
				return options.get().then((data) => {
					params.method = 'track.getinfo';
					params.autocorrect = data.useAutocorrect ? 1 : 0;
					params.artist = song.getArtist();
					params.track = song.getTrack();

					return this.doRequest('GET', params, false).then(($doc) => {
						let result = processResponse($doc);
						if (!result.isOk()) {
							throw new Error('Unable to load song info');
						}

						return this.parseSongInfo($doc);
					}).then((data) => {
						if (data) {
							this.fillSongInfo(data, song);
						}

						return data;
					});
				});
			});
		}

		/**
		 * Parse service response and return parsed data.
		 * @param  {Object} $doc Response that parsed by jQuery
		 * @return {Promise} Promise that will resolve with parsed data
		 */
		parseSongInfo($doc) {
			if ($doc.find('lfm').attr('status') !== 'ok') {
				return null;
			}

			let userloved = undefined;
			let userlovedStatus = $doc.find('userloved').text();
			if (userlovedStatus) {
				userloved = userlovedStatus === '1';
			}

			if (this.isSongInfoCorrectionSupported()) {
				let artist = $doc.find('artist > name').text();
				let track = $doc.find('track > name').text();
				let duration = (parseInt($doc.find('track > duration').text()) / 1000) || null;

				let artistThumbUrl = null;
				let imageSizes = ['extralarge', 'large', 'medium'];
				for (let imageSize of imageSizes) {
					artistThumbUrl = $doc.find(`album > image[size="${imageSize}"]`).text();
					if (artistThumbUrl) {
						break;
					}
				}

				let artistUrl = $doc.find('artist > url').text();
				let trackUrl = $doc.find('track > url').text();
				let albumUrl = $doc.find('album > url').text();

				return {
					artist, track, duration, userloved,
					artistThumbUrl, artistUrl, albumUrl, trackUrl
				};
			}

			return { userloved };
		}

		/**
		 * Fill song info according to parsed data.
		 * This function is called if service is supported song info loading
		 * and if song data is valid.
		 *
		 * @param  {Object} data Parsed data
		 * @param  {Song} song Song instance
		 */
		fillSongInfo(data, song) {
			// Set song as userloved if it's loved on all services.
			if (data.userloved !== undefined) {
				if (data.userloved) {
					song.metadata.attr({ userloved: true });
				} else if (song.metadata.userloved) {
					song.metadata.attr({ userloved: false });
				}
			}
		}

		/**
		 * Check if service supports retrieving of song info.
		 * @return {Boolean} True if service supports that; false otherwise
		 */
		isSongInfoLoadingSupported() {
			return false;
		}

		/**
		 * Check if service supports correction of song info.
		 * @return {Boolean} True if service supports that; false otherwise
		 */
		isSongInfoCorrectionSupported() {
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
					'track[0]': song.getTrack(),
					'artist[0]': song.getArtist(),
					sk: sessionID
				};

				if (song.getAlbum()) {
					params['album[0]'] = song.getAlbum();
				}

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
					'track': song.getTrack(),
					'artist': song.getArtist(),
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

		debugLog(text, type = 'log') {
			let message = `${this.label}: ${text}`;

			switch (type) {
				case 'log':
					console.log(message);
					break;
				case 'warn':
					console.warn(message);
					break;
				case 'error':
					console.error(message);
					break;
			}
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
			return new ServiceCallResult(ServiceCallResult.ERROR_OTHER);
		}

		let acceptedCounter = $doc.find('scrobbles').attr('accepted');
		if (acceptedCounter && acceptedCounter === '0') {
			// The song is ignored by service.
			return new ServiceCallResult(ServiceCallResult.IGNORED);
		}

		return new ServiceCallResult(ServiceCallResult.OK);
	}

	return BaseScrobbler;
});
