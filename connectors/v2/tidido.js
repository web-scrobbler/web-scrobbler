'use strict';

/* global Connector */

Connector.playerSelector = '#player-layout';

Connector.artistSelector = '.d1 .artist-name';

Connector.trackSelector = '.d1 .song-name';

Connector.trackArtImageSelector = '.d1 .album-image img';

Connector.isPlaying = function() {
	return $('#player-layout').hasClass('playing');
};
