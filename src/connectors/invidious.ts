'use strict';

Connector.playerSelector = '#player';

Connector.artistTrackSelector = 'h1';

Connector.currentTimeSelector = '.vjs-current-time-display';

Connector.durationSelector = '.vjs-duration-display';

Connector.getArtistTrack = () => {
	const text = $(Connector.artistTrackSelector).text();
	return Util.processYtVideoTitle(text);
};

Connector.getUniqueID = () => {
	const videoUrl = $('h1 a').attr('href');
	return Util.getYtVideoIdFromUrl(videoUrl);
};

Connector.isPlaying = () => $('.vjs-play-control').hasClass('vjs-playing');

Connector.applyFilter(MetadataFilter.getYoutubeFilter());
