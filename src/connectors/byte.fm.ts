export {};

Connector.playerSelector = '.player';

Connector.artistTrackSelector = '.player-current-title';

Connector.isPlaying = () =>
	Util.getTextFromSelectors('.player-play-button') !== 'play';

Connector.onReady = Connector.onStateChanged;
