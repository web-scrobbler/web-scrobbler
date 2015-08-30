'use strict';

/**
 * Module for all communication with libre.fm
 */
define([
	'scrobblers/baseScrobbler'
], function (BaseScrobbler) {

	var LibreFM = new BaseScrobbler({
		label: 'Libre.FM',
		storage: 'LibreFM',
		apiUrl: 'https://libre.fm/2.0/',
		apiKey: '',
		apiSecret: '',
		authUrl: 'http://www.libre.fm/api/auth/'
	});

	return LibreFM;
});
