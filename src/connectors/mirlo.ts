export {};

Connector.playerSelector = '#player';
Connector.trackSelector = `${Connector.playerSelector} #player-track-title`;
Connector.artistSelector = `${Connector.playerSelector} #player-artist-name`;
Connector.albumSelector = `${Connector.playerSelector} #player-trackGroup-title`;
Connector.trackArtSelector = `${Connector.playerSelector} img`;
Connector.playButtonSelector = `${Connector.playerSelector} .play-button`;
Connector.isPlaying = () =>
	Util.getAttrFromSelectors(Connector.playButtonSelector, 'aria-label') !==
	'Play';
