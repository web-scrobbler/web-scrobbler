'use strict';

var meta = $('.e2-player-meta-song').text().split(' · ');
/* global Connector */
Connector.playerSelector = '.e2-player';
Connector.playButtonSelector = '.e2-player-control-play';

Connector.isPlaying = function() {
	return !$('.e2-player-control-play').is(':visible');
};

Connector.getArtist = function() {
	return meta[0];
};

Connector.getTrack = function() {
	return meta[1];
};

$(document).ready(function(){
	// Needed because DOM is not changed during first song
	setTimeout(function() {
		$(Connector.playerSelector).append('<div class="webscrobbler-connector-loaded" style="display:none;"></div>');
	}, 1000);
});
