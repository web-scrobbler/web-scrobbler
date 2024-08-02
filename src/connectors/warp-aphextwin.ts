export {};

Connector.playerSelector = '.player';

Connector.artistSelector = '.current-track .js-current-track-artist';

Connector.trackSelector = '.current-track .js-current-track-title';

Connector.durationSelector = '.current-track .js-current-track-duration';

Connector.currentTimeSelector = '.current-time.js-current-time';

Connector.playButtonSelector = '.track-controls .js-play-track';

Connector.getArtist = () => {
	return Util.getTextFromSelectors(Connector.artistSelector)?.replace(
		'- ',
		'',
	);
};

Connector.getAlbum = () => {
	const releasePath = Util.getAttrFromSelectors(
		Connector.trackSelector,
		'href',
	);
	return Util.getAttrFromSelectors(
		`.track-list .track-release a[href="${releasePath}"]`,
		'title',
	);
};
