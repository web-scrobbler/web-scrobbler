'use strict';

Connector.playerSelector = '#audioplayer';

Connector.artistTrackSelector = '#zen-video-title';

Connector.currentTimeSelector = '.plyr__time--current';

Connector.durationSelector = '.plyr__time--duration';

Connector.getArtistTrack = () => {
	let text = $(Connector.artistTrackSelector).text();
	return Util.processYoutubeVideoTitle(text);
};

Connector.getUniqueID = () => {
	let videoUrl = $('#zen-video-title').attr('href');
	return Util.getYoutubeVideoIdFromUrl(videoUrl);
};

Connector.isPlaying = () => $('.plyr').hasClass('plyr--playing');

Connector.filter = MetadataFilter.getYoutubeFilter();
