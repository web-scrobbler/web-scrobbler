export {};

Connector.playerSelector = '.container';

Connector.artistSelector =
	'.list-body > div:nth-child(1) > div:nth-child(2) > p';

Connector.trackSelector =
	'.list-body > div:nth-child(1) > div:nth-child(3) > p';

Connector.isPlaying = () => {
	return (
		Util.getAttrFromSelectors(
			'.controls-container > div > button:nth-child(1)',
			'ng-click',
		) === 'stop()'
	);
};

Connector.onReady = Connector.onStateChanged;
