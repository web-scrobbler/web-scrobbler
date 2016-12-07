'use strict';

/* global Connector, MetadataFilter */

Connector.playerSelector = '#page_sidebar';

Connector.getArtist = function() {
	var artists = $.map($('.player-track-artist').children(), function(artist) {
		return $.text(artist);
	});
	return artists.join(', ');
};

Connector.trackSelector = '.player-track-title';

Connector.currentTimeSelector = '.player-progress .progress-time';

Connector.durationSelector = '.player-progress .progress-length';

Connector.trackArtImageSelector = '.player-cover img';

Connector.filter = MetadataFilter.getRemasteredFilter();

Connector.isPlaying = function () {
	return $('.svg-icon-pause').length > 0;
};
