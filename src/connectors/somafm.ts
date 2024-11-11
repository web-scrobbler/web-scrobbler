export {};

Connector.playerSelector = '.frameContents';

Connector.artistSelector =
	'tr.songHistoryLine:nth-child(1) > td:nth-child(2) > div:nth-child(2)';

Connector.trackSelector =
	'tr.songHistoryLine:nth-child(1) > td:nth-child(2) > div:nth-child(1)';

Connector.isPlaying = () => {
	return (
		Util.getAttrFromSelectors(
			'.controls-container > div > button:nth-child(1)',
			'ng-click',
		) === 'stop()'
	);
};

Connector.onReady = Connector.onStateChanged;
