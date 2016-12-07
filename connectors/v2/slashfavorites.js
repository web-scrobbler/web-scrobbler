'use strict';

/* global Connector */

Connector.playerSelector = '#container';

Connector.artistSelector = '#artist .currently a:not(".swap")';

Connector.trackSelector = '#track .currently a:not(".swap")';

Connector.isPlaying = function () {
	return $('.playpause').text() === 'pause';
};
