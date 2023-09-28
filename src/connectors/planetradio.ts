export {};

Connector.playerSelector = [
	'#__next > div > div > div:first-child',
	'.now-playing-wrapper',
];

Connector.artistSelector = [
	'#__next > div > div > div:first-child > div:nth-child(5) > div > div:nth-child(2) > p:nth-child(2)',
	'.text-right .title',
];

Connector.trackSelector = [
	'#__next > div > div > div:first-child > div:nth-child(5) > div > div:nth-child(2) > p:nth-child(3)',
	'.text-right .track',
];

Connector.trackArtSelector = [
	'#__next > div > div > div:first-child > div:nth-child(5) img',
	'.now-playing-block.right .image',
];

Connector.playButtonSelector = [
	'#__next > div > div > div:first-child [data-icon="play"]',
	'.play',
];
