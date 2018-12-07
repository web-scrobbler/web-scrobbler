'use strict';

Connector.playerSelector = '#player';

Connector.playButtonSelector = '#playMediaMaster';

Connector.getArtistTrack = () => {
	let artistTrackStr = $('#song-name-info').text();
	let artistTrack = artistTrackStr.split('•');

	let artist = artistTrack[0];
	let track = artistTrack[artistTrack.length - 1];
	return { artist, track };
};
