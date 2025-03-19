export {};

Connector.playerSelector = '[data-testid=sticky-player]';

Connector.getArtistTrack = () => {
	const text = Util.getTextFromSelectors('[data-testid=status-display]');

	if (text) {
		const artist = text.split(' - ')[0];
		const track = text.split(' - ')[1];
		return { artist, track };
	}
	return null;
};

Connector.isPlaying = () =>
	Util.getAttrFromSelectors('[data-testid=global-player-pause]', 'title') !== 'Wiedergabe';
