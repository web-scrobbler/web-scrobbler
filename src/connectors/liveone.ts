export {};

const playerBar = '#radio';

Connector.playerSelector = playerBar;

Connector.pauseButtonSelector = `${playerBar} .playpause.pause`;

Connector.trackSelector = `${playerBar} .metadata .title`;

Connector.artistSelector = `${playerBar} .metadata .playable-artist`;

Connector.currentTimeSelector = '.vjs-current-time-display';

Connector.durationSelector = '.vjs-duration-display';

Connector.trackArtSelector = '.current-track-imgContainer img';

Connector.isScrobblingAllowed = () => {
	return Connector.getArtist() !== 'LiveOne';
};
