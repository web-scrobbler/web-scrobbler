'use strict';

/* global Connector */

// default selectors of jplayer.org
Connector.playerSelector = '.jp-audio';
Connector.currentTimeSelector = '.jp-time-holder div';
Connector.playButtonSelector = '.jp-play';

Connector.getArtistTrack = function () {
	var artist = $('#searchme').attr('data-title');
	var track = $('#searchme').attr('data-artist');
	return {artist: artist, track: track};
};
