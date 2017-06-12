'use strict';

/* global Connector */

Connector.playerSelector = '#playdeck';

Connector.getArtist = function() {
	return $('#songdetails_artist').text().split(' - ')[0];
};

Connector.trackSelector = '#songdetails_song';

Connector.isPlaying = function() {
	return !$('#playdeck audio').pausedi;
};

Connector.getAlbum = function() {
	return $('#songdetails_artist').text().split(' - ')[1];
};

Connector.trackArtSelector = '#coverartimage img';

Connector.currentTimeSelector = '#played';

Connector.durationSelector = '#duration';
