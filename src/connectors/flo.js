'use strict';

<<<<<<< HEAD
Connector.playerSelector = '.player';

Connector.artistSelector = '.info_artist .name';

Connector.trackSelector = '.song_marquee span:first';

Connector.currentTimeSelector = '.played';

Connector.durationSelector = '.total';

Connector.isPlaying = () => {
	return $('.player_controller .is_paused').length !== 0;
};

Connector.trackArtSelector = '.player_cover .cover img';
=======
Connector.playerSelector = '#app .player_ct mini';

Connector.artistSelector = '.track_info .artist';

Connector.trackSelector = '.track_info .title';

Connector.currentTimeSelector = '.time_current';

Connector.durationSelector = '.time_all';

Connector.pauseButtonSelector = '.control_area .icon-player btn-player-play';

Connector.trackArtSelector = '.playbar_ct .thumb';
>>>>>>> e2a27c2ae2c86ad762ee2cfcb709d3679ae711aa
