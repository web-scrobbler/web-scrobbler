'use strict';

define([
	'jquery',
	'config',
	'vendor/md5',
	'wrappers/can',
	'objects/serviceCallResult',
	'chromeStorage'
], function ($, config, MD5, can, ServiceCallResultFactory, ChromeStorage) {

	function BaseScrobbler(options) {
		this.enableLogging = true;
		this.apiUrl = options.apiUrl;
		this.apiKey = options.apiKey;
		this.apiSecret = options.apiSecret;
		this.storage = ChromeStorage.getNamespace(options.storage);
	}

	BaseScrobbler.prototype = {
		constructor: BaseScrobbler,

		/**
		 * Creates query string from object properties.
		 *
		 * @param params
		 * @returns {string}
		 */
		createQueryString: function (params) {
			var parts = [];

			for (var x in params) {
				if (params.hasOwnProperty(x)) {
					parts.push(x + '=' + encodeURIComponent(params[x]));
				}
			}

			return parts.join('&');
		},

		/**
		 * Calls callback with URL where user should grant permissions to our token or null on error.
		 * If an error occurs, callback is called with null.
		 *
		 * Stores the new obtained token into storage so it will be traded for a new session when needed.
		 * Because of this it is necessary this method is called only when user is really going to
		 * approve the token and not sooner. Otherwise use of the token would result in an unauthorized request.
		 *
		 * See http://www.last.fm/api/show/auth.getToken
		 *
		 * @param cb
		 */
		getAuthUrl: function (cb) {
			var self = this;
			var http_request = new XMLHttpRequest();
			http_request.open('GET', this.apiUrl + '?method=auth.gettoken&api_key=' + this.apiKey, false); // synchronous
			http_request.setRequestHeader('Content-Type', 'application/xml');
			http_request.send();

			console.log('getToken response: %s', http_request.responseText);

			var xmlDoc = $.parseXML(http_request.responseText);
			var xml = $(xmlDoc);
			var status = xml.find('lfm').attr('status');


			this.storage.get(function (data) {
				if (status != 'ok') {
					console.log('Error acquiring a token: %s', http_request.responseText);

					data.token = null;
					self.storage.set(data, function () {
						cb(null);
					});
				} else {
					// set token and reset session so we will grab a new one
					data.sessionID = null;
					data.token = xml.find('token').text();
					self.storage.set(data, function () {
						cb('https://www.last.fm/api/auth/?api_key=' + self.apiKey + '&token=' + data.token);
					});
				}
			});
		},

		/**
		 * Calls callback with sessionID or null if there is no session or token to be traded for one.
		 *
		 * If there is a stored token it is preferably traded for a new session which is then returned.
		 *
		 * @param cb
		 */
		getSession: function (cb) {
			this.storage.get(function (data) {
				// if we have a token it means it is fresh and we want to trade it for a new session ID
				var token = data.token || null;
				if (token) {
					this.tradeTokenForSession(token, function (session) {
						if (session === null || typeof session.key === 'undefined') {
							console.warn('Failed to trade token for session - the token is probably not authorized');

							// both session and token are now invalid
							data.token = null;
							data.sessionID = null;
							data.sessionName = null;
							this.storage.set(data, function () {
								cb(null,null);
							});
						} else {
							// token is already used, reset it and store the new session
							data.token = null;
							data.sessionID = session.key;
							data.sessionName = session.name;
							this.storage.set(data, function () {
								cb(data.sessionID, data.sessionName);
							});
						}
					});
				}
				else {
					cb(data.sessionID, data.sessionName);
				}
			});
		},

		/**
		 * Does a call to API to trade token for session ID.
		 * Assumes the token was authenticated by the user.
		 *
		 * @param {String} token
		 * @param {Function} cb result of the trade will be passed as the only parameter
		 */
		tradeTokenForSession: function (token, cb) {
			var params = {
				method: 'auth.getsession',
				api_key: this.apiKey,
				token: token
			};
			var apiSig = this.generateSign(params);
			var url = this.apiUrl + '?' + this.createQueryString(params) + '&api_sig=' + apiSig + '&format=json';

			$.getJSON(url)
				.done(function (response) {
					if ((response.error && response.error > 0) || !response.session) {
						console.log('auth.getSession response: ' + JSON.stringify(response));
						cb(null);
					} else {
						cb(response.session);
					}
				})
				.fail(function (jqxhr, textStatus, error) {
					console.error('auth.getSession failed: ' + error + ', ' + textStatus);
				});
		},

		/**
		 * Computes string for signing request
		 *
		 * See http://www.last.fm/api/authspec#8
		 */
		generateSign: function (params) {
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
				if (keys[i] == 'format' || keys[i] == 'callback') {
					continue;
				}

				o = o + keys[i] + params[keys[i]];
			}

			// append secret
			return MD5(o + this.apiSecret);
		},

		/**
		 * Executes asynchronous request to L.FM and returns back in either callback
		 *
		 * API key will be added to params by default
		 * and all parameters will be encoded for use in query string internally
		 *
		 * @param method [GET,POST]
		 * @param params object of key => value url parameters
		 * @param signed {Boolean} should the request be signed?
		 * @param okCb
		 * @param errCb
		 */
		doRequest: function (method, params, signed, okCb, errCb) {
			var self = this;
			params.api_key = config.apiKey;

			if (signed) {
				params.api_sig = this.generateSign(params);
			}

			var paramPairs = [];
			for (var key in params) {
				if (params.hasOwnProperty(key)) {
					paramPairs.push(key + '=' + encodeURIComponent(params[key]));
				}
			}

			var url = this.apiUrl + '?' + paramPairs.join('&');

			var internalOkCb = function (xmlDoc, status) {
				if (self.enableLogging) {
					console.info('L.FM response to ' + url + ' : ' + status + '\n' + (new XMLSerializer()).serializeToString(xmlDoc));
				}

				okCb.apply(this, arguments);
			};

			var internalErrCb = function (jqXHR, status, response) {
				if (self.enableLogging) {
					console.error('L.FM response to ' + url + ' : ' + status + '\n' + response);
				}

				errCb.apply(this, arguments);
			};

			if (method === 'GET') {
				$.get(url)
					.done(internalOkCb)
					.fail(internalErrCb);
			} else if (method === 'POST') {
				$.post(url)
					.done(internalOkCb)
					.fail(internalErrCb);
			} else {
				console.error('Unknown method: ' + method);
			}
		},

		/**
		 * Asynchronously loads song info into given song object
		 *
		 * Can be used as a validation if L.FM has the song in database and also
		 * fetches some useful metadata, if the song is found
		 *
		 * To wait for this call to finish, observe changes on song object
		 * using song.bind('change', function(){...})
		 *
		 * @param song {Song}
		 * @param cb {Function(boolean)} callback where validation result will be passed
		 */
		loadSongInfo: function (song, cb) {
			var self = this;

			this.getSession(function (sessionID, sessionName) {
				var params = {
					method: 'track.getinfo',
					autocorrect: localStorage.useAutocorrect ? localStorage.useAutocorrect : 0,
					username: sessionName,
					artist: song.processed.artist || song.parsed.artist,
					track: song.processed.track || song.parsed.track
				};

				if (params.artist === null || params.track === null) {
					song.flags.attr('isLastfmValid', false);
					cb(false);
					return;
				}

				var okCb = function (xmlDoc) {
					var $doc = $(xmlDoc);

					can.batch.start();

					song.processed.attr({
						artist: $doc.find('artist > name').text(),
						track: $doc.find('track > name').text(),
						duration: parseInt($doc.find('track > duration').text()) / 1000
					});

					var thumbUrl = song.getTrackArt();
					if (thumbUrl === null) {
						thumbUrl = $doc.find('album > image[size="medium"]').text();
					}

					song.metadata.attr({
						artistUrl: $doc.find('artist > url').text(),
						trackUrl: $doc.find('track > url').text(),
						userloved: $doc.find('userloved').text() == 1,
						artistThumbUrl: thumbUrl
					});

					song.flags.attr('isLastfmValid', true);

					can.batch.stop();

					cb(true);
				};

				var errCb = function () {
					song.flags.attr('isLastfmValid', false);
					cb(false);
				};

				self.doRequest('GET', params, false, okCb, errCb);
			});
		},

		/**
		 * Send current song as 'now playing' to API
		 * @param {Song} song
		 * @param {Function} cb callback with single bool parameter of success
		 */
		sendNowPlaying: function (song, cb) {
			var self = this;
			this.getSession(function (sessionID) {
				if (sessionID === false) {
					cb(false);
				}

				var params = {
					method: 'track.updatenowplaying',
					track: song.getTrack(),
					artist: song.getArtist(),
					api_key: config.apiKey,
					sk: sessionID
				};

				if (song.album) {
					params.album = song.getAlbum();
				}
				if (song.duration) {
					params.duration = song.getDuration();
				}

				var okCb = function (xmlDoc) {
					var $doc = $(xmlDoc);

					if ($doc.find('lfm').attr('status') == 'ok') {
						cb(true);
					} else {
						cb(false); // request passed but returned error
					}
				};

				var errCb = function () {
					cb(false);
				};

				self.doRequest('POST', params, true, okCb, errCb);
			});
		},

		/**
		 * Send song to API to scrobble
		 * @param {can.Map} song
		 * @param {Function} cb callback with single ServiceCallResult parameter
		 */
		scrobble: function (song, cb) {
			var self = this;
			this.getSession(function (sessionID) {
				if (!sessionID) {
					var result = new ServiceCallResultFactory.ServiceCallResult(ServiceCallResultFactory.results.ERROR_AUTH);
					cb(result);
				}

				var params = {
					method: 'track.scrobble',
					'timestamp[0]': song.metadata.startTimestamp,
					'track[0]': song.processed.track || song.parsed.track,
					'artist[0]': song.processed.artist || song.parsed.artist,
					api_key: config.this.apiKey,
					sk: sessionID
				};

				if (song.processed.album || song.parsed.album) {
					params['album[0]'] = song.processed.album || song.parsed.album;
				}

				var okCb = function (xmlDoc) {
					var $doc = $(xmlDoc),
						result;

					if ($doc.find('lfm').attr('status') == 'ok') {
						result = new ServiceCallResultFactory.ServiceCallResult(ServiceCallResultFactory.results.OK);
						cb(result);
					} else {  // request passed but returned error
						result = new ServiceCallResultFactory.ServiceCallResult(ServiceCallResultFactory.results.ERROR);
						cb(result);
					}
				};

				var errCb = function (jqXHR, status, response) {
					var result;

					if ($(response).find('lfm error').attr('code') == 9) {
						result = new ServiceCallResultFactory.ServiceCallResult(ServiceCallResultFactory.results.ERROR_AUTH);
					}
					else {
						result = new ServiceCallResultFactory.ServiceCallResult(ServiceCallResultFactory.results.ERROR_OTHER);
					}

					cb(result);
				};

				self.doRequest('POST', params, true, okCb, errCb);
			});
		},

		/**
		 * Send song to API to LOVE or UNLOVE
		 * @param {can.Map} song
		 * @param {Boolean} shouldBeLoved true = send LOVE request, false = send UNLOVE request
		 * @param {Function} cb callback with single ServiceCallResult parameter
		 */
		toggleLove: function (song, shouldBeLoved, cb) {
			var self = this;
			this.getSession(function (sessionID) {
				if (!sessionID) {
					var result = new ServiceCallResultFactory.ServiceCallResult(ServiceCallResultFactory.results.ERROR_AUTH);
					cb(result);
				}

				var params = {
					method: 'track.' + (shouldBeLoved ? 'love' : 'unlove' ),
					'track': song.processed.track || song.parsed.track,
					'artist': song.processed.artist || song.parsed.artist,
					api_key: config.this.apiKey,
					sk: sessionID
				};

				var okCb = function (xmlDoc) {
					var $doc = $(xmlDoc);

					if ($doc.find('lfm').attr('status') == 'ok') {
						cb(true);
					} else {
						cb(false); // request passed but returned error
					}
				};

				var errCb = function () {
					cb(false);
				};

				self.doRequest('POST', params, true, okCb, errCb);
			});
		},

		/**
		 * Get the active state of the scrobbler.
		 *
		 * @param cb
		 */
		isActive: function (cb) {
			this.storage.get(cb);
		}
	};


	return BaseScrobbler;
});
