'use strict';

/* global Connector */
Connector.playerSelector = '#player';

Connector.artistSelector = '#track-title > #artist';
Connector.trackSelector = '#track-title > #title';

Connector.isPlaying = function() {
	return $('#play').text() == "pause";
};