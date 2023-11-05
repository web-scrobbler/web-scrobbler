export {};

/**
 * Stations have Artist-Track info reversed.
 * Each entry is a part of station URL.
 */
const STATIONS_SWAP = ['Cat-Country-987', '885-FM-So-Cal'];

const playerBar = '[class^=player-module__playerContainer]';
const artistTrackSelector = '#playerTitle';
const stationNameSelector = '[class^=nowPlaying-module__link]';

Connector.playerSelector = playerBar;

Connector.getArtistTrack = () => {
	const artistTrackText = Util.getTextFromSelectors(artistTrackSelector);

	if (artistTrackText) {
		const swap = shouldSwapArtistTrack();
		return Util.splitArtistTrack(artistTrackText, null, swap);
	}

	return null;
};

Connector.trackArtSelector = '#playerArtwork';

Connector.pauseButtonSelector = `${playerBar} [data-icon=stop]`;

function shouldSwapArtistTrack() {
	const stationUrl = Util.getAttrFromSelectors(stationNameSelector, 'href');
	if (!stationUrl) {
		return false;
	}

	for (const station of STATIONS_SWAP) {
		if (stationUrl.includes(station)) {
			return true;
		}
	}

	return false;
}
