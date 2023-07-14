export {};

Connector.playerSelector = '.syno-as-control';

Connector.trackSelector = '.info-title';

Connector.getTrackInfo = () => {
	const albumArtistText =
		document.querySelector('.info-album-artist')?.textContent;

	if (!albumArtistText) {
		return {};
	}

	const album = albumArtistText.substr(0, albumArtistText.lastIndexOf(' - '));
	const artist = albumArtistText.substr(
		albumArtistText.lastIndexOf(' - ') + 3
	);

	return { artist, album };
};

Connector.currentTimeSelector = '.info-position';

Connector.durationSelector = '.info-duration';

Connector.trackArtSelector = '.player-info-thumb';

Connector.isPlaying = () =>
	Util.hasElementClass('.player-play > span', 'player-btn-pause');
