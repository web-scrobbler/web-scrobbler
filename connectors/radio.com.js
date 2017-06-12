'use strict';

/* global Connector */

Connector.playerSelector = '.player-body-container';

Connector.artistSelector = '.player-body-container .track-artist';

Connector.trackSelector = '.player-body-container .track-title';

Connector.trackArtSelector = '.player-img-container img';

Connector.isPlaying = function () {
	return $('.play-container i').hasClass('fa-stop');
};
