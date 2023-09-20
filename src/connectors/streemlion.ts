export {};

Connector.playerSelector = '.player-wpr';

Connector.artistSelector = `${Connector.playerSelector} .track-info .artist-name`;

Connector.trackSelector = `${Connector.playerSelector} .track-info .track-title`;

Connector.trackArtSelector = `${Connector.playerSelector} .album-cover`;

Connector.isPlaying = () =>
	Util.hasElementClass(
		`${Connector.playerSelector?.toString()} .ppBtn`,
		'playing',
	);
