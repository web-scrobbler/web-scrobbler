'use strict';

/* global Connector */

Connector.playerSelector = 'div.player-current-audio';

Connector.artistSelector = '.current-artist .ng-binding';

Connector.trackSelector = '.current-track';

Connector.isPlaying = function () {
	return $('.player-control.pause-state').is(':visible');
};

/* Ignore changes while loading and scrubbing.
 *	 .player-handle:active occurs when user is scrubbing
 *	 .loading-state.spin classes are attached to play button during load
*/
Connector.isStateChangeAllowed = function () {
	return (!$('.player-handle:active')[0] && !$('.loading-state.spin')[0]);
};
