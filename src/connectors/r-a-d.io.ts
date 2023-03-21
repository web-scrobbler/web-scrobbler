export {};

const playPauseButtonSelector = '#stream-play';

Connector.artistTrackSelector = '#np';

Connector.playerSelector = '.dynamic-row > .col-md-6';

Connector.durationSelector = '#progress-length';

Connector.currentTimeSelector = '#progress-current';

Connector.isPlaying = () =>
	Util.getTextFromSelectors(playPauseButtonSelector) === 'Stop Stream';
