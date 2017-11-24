'use strict';

define((require) => {
	const $ = require('jquery');
	const MD5 = require('vendor/md5');
	const Util = require('util');
	const ChromeStorage = require('storage/chromeStorage');
	const ServiceCallResult = require('objects/serviceCallResult');

	const REQUEST_TIMEOUT = 15000;

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
		 * URL used to view user profile.
		 * @type {String}
		 */
		'profileUrl',
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
	 * as result or error value in functions that perform API calls.
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
			return this.doRequest('GET', params, false).then(($doc) => {
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
			return this.getSession().then((session) => {
				return `${this.profileUrl}${session.sessionName}`;
			});
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
		 * @return {Promise} Promise that will be resolved with check value
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
		doRequest(method, params, signed) {
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

			return Util.timeoutPromise(REQUEST_TIMEOUT, promise).catch(() => {
				throw new ServiceCallResult(ServiceCallResult.ERROR_OTHER);
			});
		}

		/**
		 * Asynchronously loads song info into given song object.
		 *
		 * @param  {Song} song Song instance
		 * @return {Promise} Promise that will be resolved with 'isValid' flag
		 */
		getSongInfo(song) {
			return this.getSession().then(({ sessionName }) => {
				return { username: sessionName };
			}).catch(() => {
				return {};
			}).then((params) => {
				params.method = 'track.getinfo';
				params.artist = song.getArtist();
				params.track = song.getTrack();

				if (song.getAlbum()) {
					params.album = song.getAlbum();
				}

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
		}

		/**
		 * Parse service response and return parsed data.
		 * @param  {Object} $doc Response that parsed by jQuery
		 * @return {Promise} Promise that will be resolved with parsed data
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

			if (this.canCorrectSongInfo()) {
				let artist = $doc.find('artist > name').text();
				let track = $doc.find('track > name').text();
				let album = $doc.find('album > title').text();
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
					artist, track, album, duration, userloved,
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
		canLoadSongInfo() {
			return false;
		}

		/**
		 * Check if service supports correction of song info.
		 * @return {Boolean} True if service supports that; false otherwise
		 */
		canCorrectSongInfo() {
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
					method: isLoved ? 'track.love' : 'track.unlove',
					track: song.getTrack(),
					artist: song.getArtist(),
					sk: sessionID
				};

				return this.doRequest('POST', params, true).then(processResponse);
			});
		}

		/**
		 * Get the scrobbler label.
		 * @return {String} Scrobbler label
		 */
		getLabel() {
			return this.label;
		}

		/**
		 * Helper function to show debug output.
		 * @param  {String} text Debug message
		 * @param  {String} type Log type
		 */
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
