export {};

Connector.playerSelector = '#player';
Connector.trackSelector = '#player #player-track-title';
Connector.artistSelector = '#player #player-artist-name';
Connector.albumSelector = '#player #player-trackGroup-title';
Connector.trackArtSelector = '#player img';
Connector.isPlaying = () =>
	Util.getAttrFromSelectors('#player .play-button', 'aria-label') !== 'Play';
