'use strict';

/* global Connector */

Connector.playerSelector = '.holder';

Connector.getArtistTrack = function () {
	var artist = $('#song_info h2').text();
	var track = $('#song_info h3').text();
	if (artist === 'rawPlayer' || artist === 'loading...') {
		return {artist: null, track: null};
	}
	if (track === 'Standard Definition Audio' || track === 'High Definition Audio') {
		return {artist: null, track: null};
	}
	return {artist: artist || null, track: track || null};
};

Connector.isPlaying = function () {
	return $('#play1 img').attr('src').indexOf('stop') !== -1;
};
