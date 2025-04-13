export {};

Connector.playerSelector = '[data-testid=sticky-player]';

Connector.getArtistTrack = () => {
	const text = Util.getTextFromSelectors('[data-testid=status-display]');

	if (text) {
		return Util.splitArtistTrack(text);
	}
	return null;
};

Connector.isPlaying = () =>
	Util.getAttrFromSelectors('[data-testid=global-player-pause]', 'title') !==
	'Wiedergabe';
