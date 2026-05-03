export {};

Connector.playerSelector = '.left-container:has(#radio-player)';
Connector.trackSelector = '.latest-song .song-name p';
Connector.artistSelector = '.latest-song .artist-name';
Connector.trackArtSelector = '.history-song img';
Connector.isPlaying = () =>
	Util.getCSSPropertyFromSelectors('#play-button', 'display') === 'none';
