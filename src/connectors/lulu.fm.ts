export {};

Connector.playerSelector = '#qtmplayer';

Connector.artistSelector = '.qtmplayer__artist';

Connector.trackSelector = '.qtmplayer__title';

Connector.isPlaying = () =>
	Util.getTextFromSelectors('#qtmplayerTime') !== '00:00';

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors(
		'.qtmplayer__cover img'
	);
	if (trackArtUrl) {
		return trackArtUrl;
	}
	return null;
};
