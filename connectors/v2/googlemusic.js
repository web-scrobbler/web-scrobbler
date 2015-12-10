'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.trackArtImageSelector = '#playerBarArt';

Connector.artistSelector = '#player-artist';

Connector.trackSelector = '#currently-playing-title';

Connector.albumSelector = '.player-album';

Connector.currentTimeSelector = '#time_container_current';

Connector.durationSelector = '#time_container_duration';

Connector.isPlaying = function() {
	return $('#player *[data-id="play-pause"]').hasClass('playing');
};
