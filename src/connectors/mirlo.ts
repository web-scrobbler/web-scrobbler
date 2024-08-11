export {};

Connector.playerSelector = '#player';
Connector.trackSelector = '#player-track-title';
Connector.artistSelector = '#player-artist-name';
Connector.albumSelector = '#player-trackGroup-title';
Connector.trackArtSelector = '#player img';
Connector.isPlaying = () =>
	Util.getAttrFromSelectors('#player .play-button', 'aria-label') !== 'Play';
