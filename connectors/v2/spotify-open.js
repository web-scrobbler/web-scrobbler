'use strict';

/* global Connector */

/**
 * The connector for new version of Spotify (open.spotify.com).
 */

const ARTIST_SEPARATOR = ', ';

Connector.playerSelector = '.now-playing-bar';

Connector.getArtist = function() {
	let artists = $('.now-playing-bar span > span > a').toArray();
	return artists.map((artist) => {
		return artist.textContent;
	}).join(ARTIST_SEPARATOR);
};

Connector.trackSelector = '.now-playing-bar div > div > div > a';

Connector.trackArtImageSelector = '.now-playing-bar .cover-art-image-loaded';

Connector.isPlaying = function() {
	return $('.spoticon-pause-32').length > 0;
};
