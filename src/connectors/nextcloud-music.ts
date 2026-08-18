export {};

const playerBar = '.app-music #controls';

Connector.useMediaSessionApi();

Connector.playerSelector = playerBar;

Connector.artistSelector = `${playerBar} .song-info .artist`;

Connector.trackSelector = `${playerBar} .song-info .title`;

Connector.trackArtSelector = `${playerBar} .albumart`;

Connector.currentTimeSelector = `${playerBar} .progress-info .progress-text span:nth-of-type(1)`;

Connector.getDuration = () => {
	return Util.stringToSeconds(
		Util.getTextFromSelectors(
			`${playerBar} .progress-info .progress-text span:nth-of-type(2)`,
		)?.split('/')[1] ?? '',
	);
};

Connector.pauseButtonSelector = `${playerBar} #play-pause-button`;
