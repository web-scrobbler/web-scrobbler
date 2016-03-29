'use strict';

/* global Connector */

Connector.playerSelector = '#player-controls';

Connector.artistSelector = '.track.playing .info .artist-name';

Connector.trackSelector = '.track.playing .info .track-name';

Connector.trackArtImageSelector = '.playing .track-image img';

Connector.playButtonSelector = '.toggle-play';

Connector.isPlaying = function () {
	return $('.toggle-play').hasClass('icon-pause');
};
