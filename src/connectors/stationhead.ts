export {};

const playerSelector =
	'#root>div>div:nth-child(2)>div>div>div>div>div:nth-child(2)>div:nth-child(2)>div';

Connector.useMediaSessionApi();

Connector.playerSelector = playerSelector;
Connector.trackSelector = `${playerSelector} p`;
Connector.artistSelector = `${playerSelector}>div>div>div p`;
