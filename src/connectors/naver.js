'use strict';

Connector.playerSelector = '.player';

Connector.artistSelector = '.info_artist .name';

Connector.trackSelector = '.song_marquee span:first';

Connector.currentTimeSelector = '.played';

Connector.durationSelector = '.total';

Connector.isPlaying = () => {
	return $('.player_controller .is_paused').length !== 0;
};

Connector.getTrackArt = () => {
	return `${$('.player_cover .cover').find('img').attr('src')}`;
};
