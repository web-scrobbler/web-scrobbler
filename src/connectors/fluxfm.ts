export {};

Connector.playerSelector = '.playbar';

Connector.getArtistTrack = () => {
	const artistTrack = Util.getTextFromSelectors('.playbar__info__artist');
	return Util.splitArtistTrack(artistTrack, null, true);
};

Connector.isPlaying = () => {
	return (
		Util.getAttrFromSelectors(
			'.playbar rs-play-button > rs-button > button',
			'title'
		) === 'Pausieren'
	);
};

Connector.isStateChangeAllowed = () => {
	const artistTrack = Util.getTextFromSelectors('.hero-player__title');
	return artistTrack?.trim() !== 'Livestream - FluxFM';
};

Connector.onReady = Connector.onStateChanged;
