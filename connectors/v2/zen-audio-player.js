'use strict';

/* global Connector, MetadataFilter */


Connector.playerSelector = '#audioplayer';

Connector.artistTrackSelector = '#zen-video-title';

Connector.currentTimeSelector = '.plyr__time--current';

Connector.durationSelector = '.plyr__time--duration';

Connector.getUniqueID = function() {
	// Get the value of the search box
	return $('#v').val();
};

Connector.isPlaying = function() {
	return $('.plyr').hasClass('plyr--playing');
};

Connector.filter = MetadataFilter.getYoutubeFilter();
