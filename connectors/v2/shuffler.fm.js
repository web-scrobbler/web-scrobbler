'use strict';

/* global Connector */

Connector.playerSelector = '#playerwrapper';

Connector.artistSelector = '.artist-name';

Connector.trackSelector = '.track-title';

Connector.isPlaying = function () {
	return $('#play-pause').hasClass('pause');
};
