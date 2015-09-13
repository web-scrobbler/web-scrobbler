'use strict';

/* global Connector */

Connector.playerSelector = '[player]';

Connector.artistSelector = '#playerArtists .ng-binding';

Connector.trackSelector = '#playerTitle .ng-binding';

Connector.isPlaying = function () {
	return $('.fa-pause').length;
};
