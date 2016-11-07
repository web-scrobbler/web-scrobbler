'use strict';

/* global Connector */

Connector.playerSelector = '.audiojs';

Connector.artistSelector = '#now-playing .artist';

Connector.trackSelector = '#now-playing .title';

Connector.isPlaying = function() {
	return $('.audiojs').hasClass('playingW');
};
