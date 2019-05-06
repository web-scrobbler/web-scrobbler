'use strict';

/**
 * Stations have Artist-Track info reversed.
 * Each entry is a part of station URL.
 * @type {Array}
 */
const STATIONS_SWAP = [
	'Cat-Country-987', '885-FM-So-Cal'
];

Connector.playerSelector = '.player__playerContainer___JEJ2U';

Connector.getArtistTrack = () => {
	const artistTrackText = $('#playerTitle').text();
	const swap = shouldSwapArtistTrack();

	return Util.splitArtistTrack(artistTrackText, null, { swap });
};

Connector.trackArtSelector = '#playerArtwork';

Connector.isPlaying = () => $('#Group-6').length > 0;

function shouldSwapArtistTrack() {
	const stationUrl = $('.nowPlaying__link___2FTVw').attr('href');

	for (const station of STATIONS_SWAP) {
		if (stationUrl.includes(station)) {
			return true;
		}
	}

	return false;
}
