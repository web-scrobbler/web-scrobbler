'use strict';

/* global Connector */

Connector.playerSelector = 'body';

Connector.artistSelector = '#span_information_artist';

Connector.trackSelector = '#span_information_title';

Connector.isPlaying = function () {
	return $('#statusLabel').text() === 'Playing';
};
