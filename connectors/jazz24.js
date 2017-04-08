'use strict';

/* global Connector */

Connector.playerSelector = '.radio-controls';

Connector.artistSelector = '.current-artist';

Connector.trackSelector = '.current-track';

Connector.albumSelector = '.current-album';

Connector.isPlaying = function() {
	return $('body').hasClass('is-playing');
};
