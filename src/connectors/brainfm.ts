export {};

Connector.playerSelector = '#root';

Connector.pauseButtonSelector = '[data-testid="playPauseButton"] > div > img';

Connector.trackArtSelector =
	'[data-testid="currentTrackInformationCard"] > img';

Connector.getTrack = () => {
	const elements = Util.queryElements('[data-testid="currentTrackTitle"]');
	if (!elements) {
		return null;
	}
	return elements[0]?.firstChild?.textContent;
};

Connector.getArtist = () => 'Brain.fm';
