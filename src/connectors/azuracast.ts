Connector.useMediaSessionApi();

Connector.playerSelector = '.radio-player-widget';

Connector.artistSelector =
	'.now-playing-details .now-playing-main div.now-playing-artist';

Connector.trackSelector = '.now-playing-title';

Connector.trackArtSelector = '.now-playing-art .album-art .album-art';

Connector.isPlaying = () =>
	Util.getAttrFromSelectors(
		'.radio-controls .radio-control-play-button',
		'title',
	) === 'Stop';
