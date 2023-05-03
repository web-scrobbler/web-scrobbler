export {};

Connector.playerSelector = '.player';

Connector.artistSelector = `${Connector.playerSelector} .artistName`;

Connector.trackSelector = `${Connector.playerSelector} .songName`;

Connector.timeInfoSelector = '.rightWrapper';

Connector.isPlaying = () =>
	Util.getAttrFromSelectors('.playerPlay', 'src')?.includes('pause');
