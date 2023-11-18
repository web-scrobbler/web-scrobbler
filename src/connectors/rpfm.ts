export {};

Connector.playerSelector = '.app-player';

Connector.getArtist = () =>
	Util.getTextFromSelectors(`${getPlayerSelector()} .radio-current-artist`);

Connector.getTrack = () =>
	Util.getTextFromSelectors(`${getPlayerSelector()} .radio-current-track`);

Connector.getTrackArt = () =>
	Util.extractImageUrlFromSelectors(
		`${getPlayerSelector()} .radio-current-cover`,
	);

Connector.durationSelector = '.track-time-duration';

Connector.currentTimeSelector = '.track-time-position';

Connector.isPlaying = () =>
	Util.getDataFromSelectors('.app-player', 'status') === 'play';

Connector.isStateChangeAllowed = () => {
	const artist = Connector.getArtist();
	if (artist === null) {
		return false;
	}
	return true;
};

function getPlayerSelector(): string {
	const single = Util.hasElementClass(
		Connector.playerSelector,
		'single-player',
	);
	return single ? '.app-player-panel' : '#broadcast-panel';
}
