'use strict';
/* global Connector */
Connector.playerSelector = '#player-core';
Connector.artistSelector = '#artist';
Connector.trackSelector = '#title';

Connector.getTrackArt = function() {
	return $('#player-current-song').attr('rel');
};

$(document).ready(function(){
	// Needed because DOM is not changed during first song
	setTimeout(function() {
		$(Connector.playerSelector).append('<div class="webscrobbler-connector-loaded" style="display:none;"></div>');
	}, 1000);
});
