export {};

const playerPopupSelector = '#audioplayer[style]';

Connector.playerSelector = 'body';

Connector.playButtonSelector = `${playerPopupSelector} .playbackcontrol .pauseplay.play`;

Connector.artistTrackSelector = `${playerPopupSelector} .playinfo .songname`;

Connector.trackArtSelector = `${playerPopupSelector} .cover img`;

Connector.currentTimeSelector = `${playerPopupSelector} .playinfo .currtime`;

Connector.durationSelector = `${playerPopupSelector} .playinfo .maxtime`;

Connector.isTrackArtDefault = (url) => url?.endsWith('audio.png');
