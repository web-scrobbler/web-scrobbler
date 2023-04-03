export {};

Connector.playerSelector = '.player';

Connector.artistSelector = '.info_artist .name';

Connector.trackSelector = '.song_marquee span:first';

Connector.currentTimeSelector = '.played';

Connector.durationSelector = '.total';

Connector.isPlaying = () => {
	return Boolean(document.querySelector('.player_controller .is_paused'));
};

Connector.trackArtSelector = '.player_cover .cover img';
