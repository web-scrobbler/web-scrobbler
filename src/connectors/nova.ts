export {};

Connector.playerSelector = '.player';

Connector.artistSelector = `${Connector.playerSelector} .artiste`;

Connector.trackSelector = `${Connector.playerSelector} .titre`;

Connector.isPlaying = () =>
	Util.hasElementClass('#jp_container_1', 'jp-state-playing');
