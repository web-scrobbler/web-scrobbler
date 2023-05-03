export {};

Connector.playerSelector = '.radioco-player';

Connector.artistSelector = '.track-artist';

Connector.trackSelector = '.track-name';

Connector.trackArtSelector = '.current-artwork';

Connector.currentTimeSelector = '.streamtime';

Connector.isPlaying = () =>
	Util.hasElementClass(Connector.playerSelector, 'playing');
