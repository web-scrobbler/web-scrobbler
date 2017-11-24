'use strict';

/**
 * Module for all communication with L.FM
 */
define((require) => {
	const BaseScrobbler = require('scrobblers/baseScrobbler');

	class LastFm extends BaseScrobbler {
		canLoadSongInfo() {
			return true;
		}

		canCorrectSongInfo() {
			return true;
		}
	}

	return new LastFm({
		label: 'Last.fm',
		storage: 'LastFM',
		apiUrl: 'https://ws.audioscrobbler.com/2.0/',
		apiKey: 'd9bb1870d3269646f740544d9def2c95',
		apiSecret: '2160733a567d4a1a69a73fad54c564b2',
		authUrl: 'https://www.last.fm/api/auth/',
		statusUrl: 'http://status.last.fm/',
		profileUrl: 'https://last.fm/user/',
	});
});
