export {};

Connector.playerSelector = '.syno-as-control';

Connector.trackSelector = '.info-title';

Connector.getTrackInfo = () => {
	const albumArtistText =
		document.querySelector('.info-album-artist')?.textContent;
	return Util.splitArtistAlbum(albumArtistText ?? '', null, true);
};

Connector.currentTimeSelector = '.info-position';

Connector.durationSelector = '.info-duration';

Connector.trackArtSelector = '.player-info-thumb';

Connector.isPlaying = () =>
	Util.hasElementClass('.player-play > span', 'player-btn-pause');
