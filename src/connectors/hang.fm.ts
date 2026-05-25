export {};

const timeDiv = 'button > span > div:last-child';

Connector.playerSelector = '#NowPlaying';

Connector.artistTrackSelector =
	'button > span > div:first-child > span:first-child';

Connector.currentTimeSelector = `${timeDiv} > div:first-child`;
Connector.durationTimeSelector = `${timeDiv} > div:last-child`;
