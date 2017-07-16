'use strict';

Connector.playerSelector = '#player-core';

Connector.artistSelector = '#artist';

Connector.trackSelector = '#title';

Connector.getTrackArt = function() {
	return $('#player-current-song').attr('rel');
};
