export {};

function setup() {
	Connector.playerSelector = '.radio-player-widget';
	Connector.playButtonSelector = 'button.radio-control-play-button';
	Connector.trackSelector = '.now-playing-title';
	Connector.artistSelector = '.now-playing-artist';
	Connector.currentTimeSelector = '.time-display-played';
	Connector.durationSelector = '.time-display-total';
	Connector.isPlaying = () =>
		document
			.getElementsByClassName('radio-control-play-button')[0]
			.getAttribute('title') === 'Stop';
}

setup();
