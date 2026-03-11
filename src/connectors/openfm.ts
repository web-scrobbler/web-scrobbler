export {};

Connector.playerSelector = '#player-controlbar';

Connector.isPodcast = () =>
	Util.hasElementClass(Connector.playerSelector, 'podcast');

Connector.artistTrackSelector = `${Connector.playerSelector} .textShortening`;

Connector.getArtistTrack = () => {
	if (Connector.isPodcast()) {
		const artist = Util.getTextFromSelectors(
			`${Connector.playerSelector} :has(.textShortening)>strong`,
		);
		const track = Util.getTextFromSelectors(
			`${Connector.playerSelector} .textShortening`,
		);
		return { artist, track };
	}
	return Util.splitArtistTrack(
		Util.getTextFromSelectors(Connector.artistTrackSelector),
	);
};

Connector.currentTimeSelector = `${Connector.playerSelector} span[data-current-time]`;

Connector.durationSelector = `${Connector.currentTimeSelector}~span`;

Connector.pauseButtonSelector = [
	`${Connector.playerSelector} button[name="play"][style*="\e822"]`, // stop button
	`${Connector.playerSelector} button[name="play"][style*="\e813"]`, // pause button
];
