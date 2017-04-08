'use strict';

/* global Connector */

Connector.playerSelector = '.lecteur';

Connector.artistSelector = '.artiste .inside_call';

Connector.trackSelector = '.info-text .name';

Connector.isPlaying = function () {
	return $('.playing').length > 0;
};
