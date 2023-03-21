export {};

Connector.playerSelector = '#player';

Connector.artistTrackSelector = '.track-meta > h5';

Connector.isPlaying = () =>
	Util.hasElementClass('.vjs-play-control', 'vjs-playing');
