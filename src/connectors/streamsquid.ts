export {};

Connector.playerSelector = '#player-bar';

Connector.getArtistTrack = () => {
	const artist = Util.getDataFromSelectors(
		'.queue-item-selected',
		'artist-name',
	);
	const track = Util.getDataFromSelectors(
		'.queue-item-selected',
		'track-name',
	);

	return { artist, track };
};

Connector.playButtonSelector = '#player-play';

Connector.currentTimeSelector = '#player-time-elpased';

Connector.durationSelector = '#player-duration';
