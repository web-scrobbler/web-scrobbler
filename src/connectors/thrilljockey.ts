export {};

Connector.playerSelector = '.audio-player';

Connector.pauseButtonSelector = `${Connector.playerSelector} .audio-player--playing`;

Connector.trackSelector = `${Connector.playerSelector} .audio-player__title`;

Connector.getTrack = () => {
	const trackName = Util.getTextFromSelectors(Connector.trackSelector);
	return trackName?.slice(trackName.indexOf(' ') + 1);
};

Connector.artistSelector = '.product-info-holder a[href^="/artists/"]';

Connector.albumSelector = '.product-info-holder .product-name';

Connector.trackArtSelector =
	'.product-image-holder .slick-slide[data-slick-index="0"] img';

Connector.getTrackArt = () =>
	`${location.origin}${Util.extractImageUrlFromSelectors(
		Connector.trackArtSelector,
	)}`;

Connector.currentTimeSelector = `${Connector.playerSelector} .audio-player__time-elapsed`;
