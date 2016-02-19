'use strict';

/* global Connector */

Connector.playerSelector = '#playdeck';

Connector.getTrackArt = function() {
	return $('#coverartimage img').attr('src') || null;
};

Connector.getArtist = function() {
	return $('#songdetails_artist').text().split(' - ')[0] || null;
};

Connector.trackSelector = '#songdetails_song';

Connector.isPlaying = function() {
	return !$('#playdeck audio').pausedi;
};

Connector.getAlbum = function() {
	return $('#songdetails_artist').text().split(' - ')[1] || null;
};

Connector.currentTimeSelector = '#played';

Connector.durationSelector = '#duration';
