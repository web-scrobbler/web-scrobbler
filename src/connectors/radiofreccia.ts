export {};

Connector.playerSelector = '.mediaPlayer-container';
Connector.trackSelector = '.onair-info-box-song .info-container > .first-line';
Connector.artistSelector =
	'.onair-info-box-song .info-container > .second-line';
Connector.albumSelector = '.onair-info-box-song .info-container > .third-line';
Connector.getTrackArt = () =>
	Util.extractUrlFromCssProperty(
		Util.getCSSPropertyFromSelectors(
			'.onair-info-box-song .image-container > img',
			'background-image',
		),
	);

Connector.playButtonSelector = '.player-controls > .icon-play';
