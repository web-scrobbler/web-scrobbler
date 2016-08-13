'use strict';

/* global Connector */

Connector.playerSelector = '#page_sidebar';

Connector.getArtist = function() {
	var artists = $.map($('.player-track-artist').children(), function(artist) {
		return $.text(artist);
	});
	return artists.join(', ');
};

Connector.trackSelector = '.player-track-title';

Connector.isPlaying = function () {
	return $('.control').hasClass('control-pause');
};
