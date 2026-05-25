export {};

const playerDisplay = '#NowPlaying button > span';
const timeDiv = '${playerDisplay} > div:last-child';

Connector.playerSelector = '#NowPlaying';

Connector.pauseButtonSelector = '#NowPlaying button';

Connector.artistTrackSelector = `${playerDisplay} > div:first-child > span:first-child`;

Connector.currentTimeSelector = `${timeDiv} > div:first-child`;
Connector.durationTimeSelector = `${timeDiv} > div:last-child`;
