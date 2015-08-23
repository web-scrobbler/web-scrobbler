'use strict';

/* global Connector */

Connector.playerSelector = '.player-name';

Connector.artistSelector = '#playing h2';

Connector.trackSelector = '#playing h3';

Connector.isPlaying = function () {
	return !$('#controls a[title=Play] i').is(':visible');
};
