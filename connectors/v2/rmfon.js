'use strict';

/* global Connector */

Connector.playerSelector = '#frame';

Connector.artistSelector = '#now-artist';

Connector.trackSelector = '#now-title';

Connector.isPlaying = function () {
	return $('#btn-play').hasClass('play-on');
};
