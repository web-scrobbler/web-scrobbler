export {};

Connector.playerSelector = '.sidebar-player';
Connector.getArtistTrack = () =>
	Util.splitArtistTrack(
		Util.getTextFromSelectors('.meta-title'),
		[' ·'],
		true,
	);

// might be flaky
Connector.pauseButtonSelector = '#Group-5';
