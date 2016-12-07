'use strict';

/* global Connector */

Connector.playerSelector = '#result';

Connector.trackArtImageSelector = '.image img';

Connector.artistSelector = 'dd.artist';

Connector.trackSelector = 'dd.track';

Connector.albumSelector = 'dd.album';

Connector.isPlaying = function() {
	return $('#play').hasClass('pause');
};
