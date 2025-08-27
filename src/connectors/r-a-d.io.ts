export {};

const playPauseButtonSelector = '#stream-play-pause';

Connector.artistTrackSelector = '#metadata';

Connector.playerSelector = '.section > .container > .mb-6';

Connector.durationSelector = '#progress-max';

Connector.currentTimeSelector = '#progress-current';

Connector.isPlaying = () =>
	Util.getTextFromSelectors(playPauseButtonSelector) === 'Stop Stream';
