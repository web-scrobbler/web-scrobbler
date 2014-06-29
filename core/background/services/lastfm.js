'use strict';

/**
 * Module for all communication with L.FM
 *
 * (some is still done in legacy/scrobbler)
 */
define([
	'jquery',
	'config',
	'vendor/md5'
], function ($, config, MD5) {

	var enableLogging = true;

	var apiUrl = 'https://ws.audioscrobbler.com/2.0/';
	var apiSecret = '2160733a567d4a1a69a73fad54c564b2';

	/**
	 * Computes string for signing request
	 *
	 * See http://www.last.fm/api/authspec#8
	 */
	function generateSign(params) {
		var keys = [];
		var o = '';

		for (var x in params) {
			keys.push(x);
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

			song.attr({
				artist: $doc.find('artist > name').text(),
				track: $doc.find('track > name').text(),
				duration: parseInt($doc.find('track > duration').text()) / 1000,
				artistThumbUrl: $doc.find('album > image[size="medium"]').text()
			});

			song.internal.attr({
				attemptedLFMValidation: true,
				isLFMValid: true
			});
		};

		var errCb = function() {
			song.internal.attr({
				attemptedLFMValidation: true,
				isLFMValid: false
			});
		};

		doRequest(params, false, okCb, errCb);
	}



	return {
		generateSign: generateSign,
		loadSongInfo: loadSongInfo
	};

});