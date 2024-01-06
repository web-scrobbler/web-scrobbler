export {};

Connector.playerSelector = '#__next > div > div > div:first-child';

Connector.artistSelector = '#playbar-play-button + div p';

Connector.trackSelector = '#playbar-play-button + div p:last-child';

Connector.trackArtSelector = '#playbar-play-button + div picture img';

Connector.isPlaying = () =>
	Util.getDataFromSelectors('#playbar-play-button svg', 'icon') !== 'play';
