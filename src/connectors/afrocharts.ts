export {};

Connector.playerSelector = '.jp-controls';
Connector.getArtistTrack = () =>
	Util.splitArtistTrack(
		Util.getTextFromSelectors('.jp-title'),
		[' - '],
		true,
	);
Connector.playButtonSelector = '.jp-play';
Connector.currentTimeSelector = '.jp-current-time';
Connector.durationSelector = '.jp-duration';
