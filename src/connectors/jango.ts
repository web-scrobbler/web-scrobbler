export {};

Connector.playerSelector = '#player';

Connector.trackSelector = '#player-song-title';

Connector.artistSelector = '#player-artist';

Connector.trackArtSelector = '#player_album_art';

Connector.isPlaying = () => {
	return (
		Util.getAttrFromSelectors('#player-play-button svg', 'data-icon') ===
		'pause-circle'
	);
};
