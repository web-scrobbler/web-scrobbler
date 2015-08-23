'use strict';

/* global Connector */

Connector.playerSelector = '.joli-music-player';

Connector.artistSelector = 'span.artist';

Connector.trackSelector = 'span.title';

Connector.isPlaying = function () {
	return !$('.joli-music-player').hasClass('pause');
};
