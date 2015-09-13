'use strict';

/* global Connector */

Connector.playerSelector = '.player';

Connector.artistSelector = '.grandparent-title';

Connector.trackSelector = '.item-title';

Connector.isPlaying = function () {
	return $('.play-btn').hasClass('hidden');
};
