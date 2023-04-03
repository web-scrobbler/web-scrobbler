export {};

let swapArtistTrack = false;
if (Util.getTextFromSelectors('.player-station-title')?.includes('Qmusic')) {
	swapArtistTrack = true;
}

Connector.playerSelector = '#jp_container_1';

Connector.getArtistTrack = function () {
	const artistTrack = Util.getTextFromSelectors('#player-station-info');
	return Util.splitArtistTrack(artistTrack, [' - '], swapArtistTrack);
};

Connector.isPlaying = () => {
	return Util.hasElementClass('#jp_container_1', 'jp-state-playing');
};
