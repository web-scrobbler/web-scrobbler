'use strict';

Connector.playerSelector = '#player';

Connector.artistTrackSelector = 'h1';

Connector.currentTimeSelector = '.vjs-current-time-display';

Connector.durationSelector = '.vjs-duration-display';

Connector.getArtistTrack = () => {
	let text = $(Connector.artistTrackSelector).text();
	return Util.processYoutubeVideoTitle(text);
};

Connector.getUniqueID = () => {
	let videoUrl = $('h1 a').attr('href');
	return Util.getYoutubeVideoIdFromUrl(videoUrl);
};

Connector.isPlaying = () => $('.vjs-play-control').hasClass('vjs-playing');

Connector.applyFilter(MetadataFilter.getYoutubeFilter());
