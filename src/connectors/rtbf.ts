export {};

Connector.playerSelector = '.player';

Connector.artistSelector = '.program-info .artist-name';

Connector.trackSelector = '.program-info .title-name';

Connector.isPlaying = () =>
	Util.hasElementClass('.player-controls a', 'paused');
