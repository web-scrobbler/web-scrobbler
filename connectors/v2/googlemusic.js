'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.artistSelector = '#player-artist';

Connector.trackSelector = '#player-song-title';

Connector.albumSelector = '.player-album';

Connector.currentTimeSelector = '#time_container_current';

Connector.isPlaying = function() {
	return $('#player *[data-id="play-pause"]').hasClass('playing');
};
