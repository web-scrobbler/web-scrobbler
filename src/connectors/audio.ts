export {};

Connector.playerSelector = '#root>div>aside';

Connector.trackSelector =
	'#root > div > aside > div > div:nth-child(2) > div:nth-child(2) > div > div > a:nth-child(1) > p';
Connector.artistSelector =
	'#root > div > aside > div > div:nth-child(2) > div:nth-child(2) > div > div > a:nth-child(2) > p';
Connector.trackArtSelector =
	'#root > div > aside > div > div:nth-child(2) > div:nth-child(2) > div > a > img';
Connector.playButtonSelector =
	'#root > div > aside > div > div:nth-child(2) > div:nth-child(1) [aria-label="play"]';

Connector.getCurrentTime = () =>
	Number(
		document
			.querySelector('[aria-label*=progress]')
			?.getAttribute('aria-valuenow'),
	);

Connector.getDuration = () =>
	Number(
		document
			.querySelector('[aria-label*=progress]')
			?.getAttribute('aria-valuemax'),
	);
