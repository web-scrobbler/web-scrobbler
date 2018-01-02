'use strict';

Connector.playerSelector = '#playdeck';

Connector.getArtist = () => {
	return $('#songdetails_artist').text().split(' - ')[0];
};

Connector.trackSelector = '#songdetails_song';

Connector.isPlaying = () => !$('#playdeck audio').pausedi;

Connector.getAlbum = () => {
	return $('#songdetails_artist').text().split(' - ')[1];
};

Connector.trackArtSelector = '#coverartimage img';

Connector.currentTimeSelector = '#played';

Connector.durationSelector = '#duration';
