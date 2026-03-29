export {};

Connector.playerSelector = '#nowPlaying';

Connector.artistSelector = '.nowPlayingCard .song .artist';

Connector.trackSelector = '.nowPlayingCard .song .title';

Connector.getAlbum = () => {
	const albumText = Util.getTextFromSelectors('.nowPlayingCard .song .album');

	if (albumText && !albumText.includes('{album}')) {
		return albumText;
	}

	return null;
};

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors(
		'.nowPlayingCard figure img',
	);

	if (trackArtUrl) {
		return trackArtUrl.replace(/(?<=\/)\d+x\d+/g, '300x300'); // larger image path
	}

	return null;
};

Connector.isTrackArtDefault = (url) => url?.includes('default');

Connector.isPlaying = () => Util.hasElementClass('#nowPlaying', 'hasSong');
