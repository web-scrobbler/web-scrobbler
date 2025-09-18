export {};

Connector.playerSelector = '#player';
Connector.trackSelector = `${Connector.playerSelector} #player-track-title`;
Connector.artistSelector = `${Connector.playerSelector} #player-artist-name`;
Connector.albumSelector = `${Connector.playerSelector} #player-trackGroup-title`;
Connector.trackArtSelector = `${Connector.playerSelector} img`;
Connector.isPlaying = () =>
	Util.getAttrFromSelectors(`${Connector.playerSelector} .play-button`, 'aria-label') !== 'Play';
