'use strict';

/* global Connector */

Connector.playerSelector = '#player-container';

Connector.getArtistTrack = function () {
	var artist = $('#artistInfo').text().trim();
	var track = $('#trackInfo').text().trim();
	if (artist === 'Loading...') {return {artist: null, track: null};}

	return {artist: artist, track: track};
};

Connector.isPlaying = function () {
	return $('#pause').is(':visible');
};
