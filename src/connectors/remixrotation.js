'use strict';

Connector.playerSelector = '#player';

Connector.playButtonSelector = '#playMediaMaster';

Connector.getArtistTrack = () => {
	const artistTrackStr = $('#song-name-info').text();
	const artistTrack = artistTrackStr.split('•');

	const artist = artistTrack[0];
	const track = artistTrack[artistTrack.length - 1];
	return { artist, track };
};
