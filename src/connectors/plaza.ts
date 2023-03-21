export {};

Connector.playerSelector = '.player-meta';

Connector.artistSelector = '.track-artist';

Connector.trackSelector = '.track-title';

Connector.trackArtSelector = '.cover img';

Connector.timeInfoSelector = '.player-time';

Connector.isPlaying = () =>
	Util.getTextFromSelectors('.player-play') === 'Stop';
