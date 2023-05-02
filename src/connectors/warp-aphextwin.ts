export {};

Connector.playerSelector = '.player';

Connector.trackSelector = '.current-track .js-current-track-title';

Connector.durationSelector = '.current-track .js-current-track-duration';

Connector.currentTimeSelector = '.current-time.js-current-time';

Connector.playButtonSelector = '.track-controls .js-play-track';

Connector.getArtist = () => {
	return Util.getTextFromSelectors(
		'.current-track .js-current-track-artist'
	)?.replace(' - ', '');
};

Connector.getAlbum = () => {
	const releasePath = Util.getAttrFromSelectors(
		Connector.trackSelector,
		'href'
	);
	return Util.getAttrFromSelectors(
		`.track-list .track-release a[href="${releasePath}"]`,
		'title'
	);
};
