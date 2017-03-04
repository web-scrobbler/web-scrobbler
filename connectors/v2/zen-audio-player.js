'use strict';

/* global Connector, MetadataFilter,  Util */


Connector.playerSelector = '#audioplayer';

Connector.artistTrackSelector = '#zen-video-title';

Connector.currentTimeSelector = '.plyr__time--current';

Connector.durationSelector = '.plyr__time--duration';

Connector.getArtistTrack = function () {
	var text = $(Connector.artistTrackSelector).text();
	return Util.processYoutubeVideoTitle(text);
};

Connector.getUniqueID = function() {
	let videoUrl = $('#zen-video-title').attr('href');
	return Util.getYoutubeVideoIdFromUrl(videoUrl);
};

Connector.isPlaying = function() {
	return $('.plyr').hasClass('plyr--playing');
};

Connector.filter = MetadataFilter.getYoutubeFilter();
