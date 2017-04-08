'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.artistSelector = '.track .artist';

Connector.trackSelector = '.track .title';

Connector.isPlaying = function () {
	return !$('#footer').hasClass('paused');
};
