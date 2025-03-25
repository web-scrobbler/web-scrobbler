export {};

if (window.location.pathname.startsWith('/player24')) {
	setupNewPlayer();
} else {
	setupOldPlayer();
}

function setupOldPlayer() {
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
}

function setupNewPlayer() {
	Connector.playerSelector = '.frameContents';

	Connector.artistSelector = '.playbackInfo__secondaryLine';

	Connector.trackSelector = '.playbackInfo__primaryLine';

	Connector.isPlaying = () => {
		// making sure selector is not null
		const playerSelector =
			document.querySelector(
				'.playbackController__actionButton > svg:nth-child(1) > path:nth-child(1)',
			) ?? document.createElement('div');

		// player is playing if 'd' attribute on SVG is the stop button path
		return (
			playerSelector.getAttribute('d') ===
			'M6 7V17C6 17.5523 6.44772 18 7 18H17C17.5523 18 18 17.5523 18 17V7C18 6.44772 17.5523 6 17 6H7C6.44772 6 6 6.44772 6 7Z'
		);
	};
}

Connector.onReady = Connector.onStateChanged;
