export {};

Connector.playerSelector = '.ui-box';

Connector.artistSelector = '.ui-box > h3';

Connector.trackSelector = '.ui-box > h2';

Connector.isPlaying = () =>
	Util.hasElementClass('.tuba-ui > button', 'play-playing');
