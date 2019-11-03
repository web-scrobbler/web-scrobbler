'use strict';

Connector.playerSelector = '#audioplayer';

Connector.artistTrackSelector = '#zen-video-title';

Connector.currentTimeSelector = '.plyr__time--current';

Connector.durationSelector = '.plyr__time--duration';

Connector.getArtistTrack = () => {
	let text = $(Connector.artistTrackSelector).text();
	return Util.processYtVideoTitle(text);
};

Connector.getUniqueID = () => {
	let videoUrl = $('#zen-video-title').attr('href');
	return Util.getYtVideoIdFromUrl(videoUrl);
};

Connector.isPlaying = () => $('.plyr').hasClass('plyr--playing');

Connector.applyFilter(MetadataFilter.getYoutubeFilter());
