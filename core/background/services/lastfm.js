'use strict';

/**
 * Module for all communication with L.FM
 *
 * (some is still done in legacy/scrobbler)
 */
define([
	'jquery',
	'config',
	'vendor/md5',
	'storage',
	'wrappers/can'
], function ($, config, MD5, Storage, can) {

	var enableLogging = true;

	var apiUrl = 'https://ws.audioscrobbler.com/2.0/';
	var apiKey = 'd9bb1870d3269646f740544d9def2c95';
	var apiSecret = '2160733a567d4a1a69a73fad54c564b2';

	var storage = Storage.getNamespace('LastFM');

	/**
	 * Creates query string from object properties
	 */
	function createQueryString(params) {
		var parts = [];

		for (var x in params) {
			if (params.hasOwnProperty(x)) {
				parts.push( x + '=' + encodeURIComponent(params[x]));
			}
		}

		return parts.join('&');
	}

	/**
	 * Returns URL where user should grant permissions to our token or null on error.
	 * Does a synchronous API call internally, so this method is blocking.
	 *
	 * Stores the new obtained token into storage so it will be traded for a new session when needed.
	 * Because of this it is necessary this method is called only when user is really going to
	 * approve the token and not sooner. Otherwise use of the token would result in an unauthorized request.
	 *
	 * See http://www.last.fm/api/show/auth.getToken
	 *
	 * @return {String}
	 */
	function getAuthUrl() {
		var http_request = new XMLHttpRequest();
		http_request.open('GET', apiUrl + '?method=auth.gettoken&api_key=' + apiKey, false); // synchronous
		http_request.setRequestHeader('Content-Type', 'application/xml');
		http_request.send();

		console.log('getToken response: %s', http_request.responseText);

		var xmlDoc = $.parseXML(http_request.responseText);
		var xml = $(xmlDoc);
		var status = xml.find('lfm').attr('status');

		if (status != 'ok') {
			console.log('Error acquiring a token: %s', http_request.responseText);
			storage.set('token', null);
			return null;
		} else {
			// set token and reset session so we will grab a new one
			storage.set('sessionID', null);
			storage.set('token', xml.find('token').text());
			return 'https://www.last.fm/api/auth/?api_key=' + apiKey + '&token=' + storage.get('token');
		}
	}

	/**
	 * Returns sessionID or null if there is no session or token to be traded for one.
	 * Does a synchronous API call internally if the session ID is not obtained yet, so this method is blocking
	 *
	 * If there is a stored token it is preferably traded for a new session which is then returned.
	 *
	 * @return {String}
	 */
	function getSessionID() {
		// if we have a token it means it is fresh and we want to trade it for a new session ID
		var token = storage.get('token') || null;
		if (token) {
			// remove from storage - token is for single use only
			storage.set('token', null);

			var session = tradeTokenForSession(token);

			if (session === null) {
				console.warn('Failed to trade token for session - the token is probably not authorized');
				storage.set('sessionID', null);
			} else {
				storage.set('sessionID', session);
			}
		}

		// return existing or just traded session or null
		return storage.get('sessionID');
	}

	/**
	 * Does a synchronous call to API to trade token for session ID.
	 * Assumes the token was authenticated by the user.
	 *
	 * @return {String,null}
	 */
	function tradeTokenForSession(token) {
		var params = {
			method: 'auth.getsession',
			api_key: apiKey,
			token: token
		};
		var apiSig = generateSign(params);
		var url = apiUrl + '?' + createQueryString(params) + '&api_sig=' + apiSig;

		var request = new XMLHttpRequest();
		request.open('GET', url, false); // synchronous
		request.setRequestHeader('Content-Type', 'application/xml');
		request.send();

		console.log('getSession response: %s', request.responseText);

		var xmlDoc = $.parseXML(request.responseText);
		var xml = $(xmlDoc);
		var status = xml.find('lfm').attr('status');

		if (status != 'ok') {
			return null;
		} else {
			return xml.find('key').text();
		}
	}

	/**
	 * Computes string for signing request
	 *
	 * See http://www.last.fm/api/authspec#8
	 */
	function generateSign(params) {
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
		return MD5(o + apiSecret);
	}


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
	function doRequest(method, params, signed, okCb, errCb) {
		params.api_key = config.apiKey;

		if (signed) {
			params.api_sig = generateSign(params);
		}

		var paramPairs = [];
		for (var key in params) {
			if (params.hasOwnProperty(key)) {
				paramPairs.push(key + '=' + encodeURIComponent(params[key]));
			}
		}

		var url = apiUrl + '?' + paramPairs.join('&');

		var internalOkCb = function(xmlDoc, status) {
			if (enableLogging) {
				console.info('L.FM response to ' + url + ' : ' + status + '\n' + (new XMLSerializer()).serializeToString(xmlDoc));
			}

			okCb.apply(this, arguments);
		};

		var internalErrCb = function(jqXHR, status, response) {
			if (enableLogging) {
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
	}


	/**
	 * Asynchronously loads song info into given song object
	 *
	 * Can be used as a validation if L.FM has the song in database and also
	 * fetches some useful metadata, if the song is found
	 *
	 * To wait for this call to finish, observe changes on song object
	 * using song.bind('change', function(){...})
	 *
	 * @param song {can.Map} with mandatory "artist" and "track" properties
	 */
	function loadSongInfo(song) {
		var params = {
			method: 'track.getinfo',
			autocorrect: localStorage.useAutocorrect ? localStorage.useAutocorrect : 0,
			artist: song.artist,
			track: song.track
		};

		var okCb = function(xmlDoc) {
			var $doc = $(xmlDoc);

			can.batch.start();

			song.metadata.attr({
				artist: $doc.find('artist > name').text(),
				track: $doc.find('track > name').text(),
				duration: parseInt($doc.find('track > duration').text()) / 1000,
				artistThumbUrl: $doc.find('album > image[size="medium"]').text()
			});

			song.attr({
				isLFMValid: true,
				attemptedLFMValidation: true
			});

			can.batch.stop();
		};

		var errCb = function() {
			can.batch.start();

			song.attr({
				'isLFMValid': false,
				'attemptedLFMValidation': true
			});

			can.batch.stop();
		};

		doRequest('GET', params, false, okCb, errCb);
	}

	/**
	 * Send current song as 'now playing' to API
	 * @param {can.Map} song
	 * @param {Function} callback with single bool parameter of success
	 */
	function sendNowPlaying(song, cb) {
		var sessionID = getSessionID();
		if (sessionID === false) {
			return;
		}

		var params = {
			method: 'track.updatenowplaying',
			track: song.track,
			artist: song.artist,
			api_key: config.apiKey,
			sk: sessionID
		};

		if (song.album) {
			params.album = song.album;
		}
		if (song.duration) {
			params.duration = song.duration;
		}

		var okCb = function(xmlDoc) {
			var $doc = $(xmlDoc);

			if ($doc.find('lfm').attr('status') == 'ok') {
				cb(true);
			} else {
				cb(false); // request passed but returned error
			}
		};

		var errCb = function() {
			cb(false);
		};

		doRequest('POST', params, true, okCb, errCb);
	}

	function getStorage() {
		return storage;
	}


	return {
		getAuthUrl: getAuthUrl,
		getSessionID: getSessionID,
		generateSign: generateSign,
		loadSongInfo: loadSongInfo,
		sendNowPlaying: sendNowPlaying,
		getStorage: getStorage
	};

});
