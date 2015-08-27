'use strict';

/**
 * Module for all communication with L.FM
 *
 * (some is still done in legacy/scrobbler)
 */
define([
	'scrobblers/baseScrobbler'
], function (BaseScrobbler) {

	var LastFM = new BaseScrobbler({
		storage: 'LastFM',
		apiUrl: 'https://ws.audioscrobbler.com/2.0/',
		apiKey: 'd9bb1870d3269646f740544d9def2c95',
		apiSecret: '2160733a567d4a1a69a73fad54c564b2'
	});

	return LastFM;
});