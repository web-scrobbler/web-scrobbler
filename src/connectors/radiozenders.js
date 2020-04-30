'use strict';

const stationTitle = Util.getTextFromSelectors('.player-station-title');
const swapArtistTrack = stationTitle && stationTitle.includes('Qmusic');

Connector.playerSelector = '#jp_container_1';

Connector.getArtistTrack = () => {
	const artistTrack = Util.getTextFromSelectors('#player-station-info');
	return Util.splitArtistTrack(artistTrack, [' - '], {
		swap: swapArtistTrack,
	});
};

Connector.isPlaying = () => {
	return Util.hasElementClass('#jp_container_1', 'jp-state-playing');
};
