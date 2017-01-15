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
	return getVideoIdFromUrl(videoUrl);
};

Connector.isPlaying = function() {
	return $('.plyr').hasClass('plyr--playing');
};

Connector.filter = MetadataFilter.getYoutubeFilter();

/**
 * Parse given video URL and return video ID.
 * @param  {String} videoUrl Video URL
 * @return {String} Video ID
 */
function getVideoIdFromUrl(videoUrl) {
	let regExp = /v=([^#\&\?]*)/;
	let match = videoUrl.match(regExp);
	if (match) {
		return match[1];
	}

	return null;
}
