'use strict';

/* global Connector */

Connector.playerSelector = 'body';

Connector.artistSelector = '.mus_player_artist';

Connector.trackSelector = '.mus_player_song';

Connector.isPlaying = function () {
	return $('#topPanelMusicPlayerControl').hasClass('toolbar_music-play__active');
};
