export {};

// MUSICat platform used by several local libraries: https://musicat.co/libraries

Connector.playerSelector = '#player-wrapper';

Connector.pauseButtonSelector = '.current-track .controls .pause-icon';

Connector.trackSelector = '.current-track .album > div:first-of-type';

Connector.getTrackInfo = () => {
	const artistAlbumText = Util.getTextFromSelectors(
		'.current-track .album .title',
	);

	if (artistAlbumText) {
		return Util.splitArtistAlbum(artistAlbumText, [', ']);
	}

	return null;
};

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors(
		'.current-track .album img.art',
	);

	if (trackArtUrl) {
		return trackArtUrl.replace(/(?<=scale_width=)\d+/g, '540'); // larger image filename
	}

	return null;
};
