/*!
 * Frekvence1.cz connector for Last.fm Scrobbler
 *
 * version: 1.0.0
 * author: jan.cermak@lagardere.cz
 *
 * (c)2016 Lagardere Active CR
 */
'use strict';
/* global Connector */
Connector.playerSelector = '#player-core';
Connector.artistSelector = '#artist';
Connector.trackSelector = '#title';

Connector.getTrackArt = function() {
	return $('#player-current-song').attr('rel');
};

$(document).ready(function(){
	// Needed because DON is not changed during first song
	setTimeout(function() {
		$(Connector.playerSelector).append('<div class="webscrobbler-connector-loaded" style="display:none;"></div>');
	}, 1000);
});
