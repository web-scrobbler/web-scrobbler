'use strict';

/**
 * Module for all communication with libre.fm
 */
define([
	'scrobblers/baseScrobbler'
], function (BaseScrobbler) {

	var LibreFM = new BaseScrobbler({
		storage: 'LibreFm',
		apiUrl: 'https://libre.fm/2.0/',
		apiKey: '',
		apiSecret: ''
	});

	return LibreFM;
});
