'use strict';

/* global Connector */

Connector.playerSelector = '.audio-controller';

Connector.artistSelector = '.info .artist';

Connector.trackSelector = '.info .song';

Connector.isPlaying = function () {
	return $('.audio-controller .any-surfer').text() === 'Stop de radiospeler';
};
