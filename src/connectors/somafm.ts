export {};

Connector.playerSelector = '.frameContents';

Connector.artistSelector =
	'tr.songHistoryLine:nth-child(1) > td:nth-child(2) > div:nth-child(2)';

Connector.trackSelector =
	'tr.songHistoryLine:nth-child(1) > td:nth-child(2) > div:nth-child(1)';

Connector.isPlaying = () => {

	// making sure selector is not null
	let playerSelector = document.querySelector('.playbackController__info') ?? document.createElement('div');

	// player is playing if it has channel name AND extra div for track info as children
	return playerSelector.childElementCount === 2;
};

Connector.onReady = Connector.onStateChanged;
