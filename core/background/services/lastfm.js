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
	 * Does a synchronous API call internally, so this method is blocking
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
			storage.set('token', xml.find('token').text());
			return 'https://www.last.fm/api/auth/?api_key=' + apiKey + '&token=' + storage.get('token');
		}
	}

	/**
	 * Returns application token or null if token was not obtained yet.
	 * This token may or may not be authorized by user
	 *
	 * @return {String}
	 */
	function getToken() {
		return storage.get('token') || null;
	}

	/**
	 * Returns sessionID or null if there is no application token or the token is not authorized.
	 * Does a synchronous API call internally if the session ID is not obtained yet, so this method is blocking
	 *
	 * @return {String}
	 */
	function getSessionID() {
		// no token no fun
		if (!getToken()) {
			return null;
		}

		// return existing session ID if any
		if (storage.get('sessionID')) {
			return storage.get('sessionID');
		}

		var params = {
			method: 'auth.getsession',
			api_key: apiKey,
			token: getToken()
		};
		var api_sig = generateSign(params);
		var url = apiUrl + '?' + createQueryString(params) + '&api_sig=' + api_sig;

		var http_request = new XMLHttpRequest();
		http_request.open('GET', url, false); // synchronous
		http_request.setRequestHeader('Content-Type', 'application/xml');
		http_request.send();

		console.log('getSession response: %s', http_request.responseText);

		var xmlDoc = $.parseXML(http_request.responseText);
		var xml = $(xmlDoc);
		var status = xml.find('lfm').attr('status');

		if (status != 'ok') {
			console.log('getSession: the token probably hasn\'t been authorized');
			storage.set('sessionID', null);
			return null;
		} else {
			storage.set('sessionID', xml.find('key').text());
			return storage.get('sessionID');
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
	 * @param params object of key => value url parameters
	 * @param signed {Boolean} should the request be signed?
	 * @param okCb
	 * @param errCb
	 */
	function doRequest(params, signed, okCb, errCb) {
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

		$.get(url)
			.done(internalOkCb)
			.fail(internalErrCb);
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

		doRequest(params, false, okCb, errCb);
	}

	/**
	 * Send current song as 'now playing' to API
	 * @param {can.Map}
	 */
	function sendNowPlaying(song) {
		// if the token/session is not authorized, wait for a while
		var sessionID = LastFM.getSessionID();
		if (sessionID === false)
			return;

		var params = {
			method: 'track.updatenowplaying',
			track: song.track,
			artist: song.artist,
			api_key: config.apiKey,
			sk: sessionID
		};

		if(typeof(song.album) != 'undefined' && song.album != null) {
			params["album"] = song.album;
		}
		if(typeof(song.duration) != 'undefined' && song.duration != null) {
			params["duration"] = song.duration;
		}

		var api_sig = LastFM.generateSign(params);
		var url = config.apiURL + createQueryString(params) + '&api_sig=' + api_sig;

		var http_request = new XMLHttpRequest();
		http_request.open("POST", url, false); // synchronous
		http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http_request.send(params);

		console.log('nowPlaying request: %s', url);
		console.log('nowPlaying response: %s', http_request.responseText);

		var xmlDoc = $.parseXML(http_request.responseText);
		var xml = $(xmlDoc);

		if (xml.find('lfm').attr('status') == 'ok') {
			console.log('now playing %s - %s', song.artist, song.track);

			// Confirm the content_script, that the song is "now playing"
			chrome.tabs.sendMessage(nowPlayingTab, {type: "nowPlayingOK"});

			// Show notification
			notifications.showPlaying(song);

			// Update page action icon
			setActionIcon(config.ACTION_NOWPLAYING);
		} else {
			notifications.showError('Please see http://status.last.fm and check if everything is OK');
		}
	}


	return {
		getAuthUrl: getAuthUrl,
		getSessionID: getSessionID,
		generateSign: generateSign,
		loadSongInfo: loadSongInfo,
		sendNowPlaying: sendNowPlaying
	};

});
