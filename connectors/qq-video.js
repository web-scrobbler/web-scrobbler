'use strict';

/* global Connector */

Connector.playerSelector = '.container_player';

Connector.getArtistTrack = function() {
	let text = $('.video_title ._base_title').attr('title');
	return this.splitArtistTrack(text);
};

Connector.splitArtistTrack = function(str) {
	let artist = '';
	let track = '';
	let artistMatch = str.split('《');
	let trackMatch = str.match(/《(.*?)》/);

	if (artistMatch.length > 0) {
		artist = artistMatch[0];
	}

	if (trackMatch.length > 1) {
		track = trackMatch[1];
	}

	return { artist, track };
};
