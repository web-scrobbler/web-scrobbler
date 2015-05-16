'use strict';

/* global Connector */

/* In lieu of playerSelector, custom detection of player state changes to allow loading and scrubbing to be ignored.
     .player-handle:active occurs when user is scrubbing
     .loading-state.spin classes are attached to play button during load
*/
var observer = new window.MutationObserver(function () {
	if (!$('.player-handle:active')[0] && !$('.loading-state.spin')[0]) {
		Connector.onStateChanged();
	}
});
var observeTarget = document.querySelector('div.player-current-audio');
var config = {
	childList: true,
	subtree: true,
	attributes: true,
	characterData: true
};
observer.observe(observeTarget, config);

Connector.artistSelector = '.current-artist .ng-binding';

Connector.trackSelector = '.current-track';

Connector.isPlaying = function () {
	return $('.player-control.pause-state').is(':visible');
};
