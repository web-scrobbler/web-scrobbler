export {};

// MUSICat platform used by several regional libraries: https://musicat.co/libraries

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
		return trackArtUrl.replace(/(?<=scale_width=)\d+/, '540'); // larger image
	}

	return null;
};

Connector.isStateChangeAllowed = () => {
	// get unique site name from logo at top of every page
	const siteName = Util.getAttrFromSelectors('#logo img', 'alt');

	if (siteName) {
		Connector.meta.label = siteName;
	}

	return true;
};
