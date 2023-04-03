export {};

Connector.playerSelector = '.player';

Connector.trackSelector = '.now-playing-title';

Connector.artistSelector = '.now-playing-artist';

Connector.currentTimeSelector = '.progress-container .timestamp:first-child';

Connector.durationSelector = '.progress-container .timestamp:last-child';

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors('.now-playing img');

	if (trackArtUrl) {
		return trackArtUrl.replace(/w\d+-h\d+/, 'w300-h300');
	}

	return null;
};

Connector.isPlaying = () => {
	const playerButton = '.player-btn.player-title svg use';
	return (
		Util.isElementVisible(playerButton) &&
		Util.getAttrFromSelectors(playerButton, 'href')?.split('#').pop() ===
			'pause'
	);
};
