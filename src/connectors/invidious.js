'use strict';

const artistTrackSelector = 'h1';

Connector.playerSelector = '#player';

Connector.currentTimeSelector = '.vjs-current-time-display';

Connector.durationSelector = '.vjs-duration-display';

Connector.getArtistTrack = () => {
	const text = Util.getTextFromSelectors(artistTrackSelector);
	return Util.processYtVideoTitle(text);
};

Connector.getUniqueID = () => {
	const videoUrl = Util.getAttrFromSelectors('h1 a', 'href');
	return Util.getYtVideoIdFromUrl(videoUrl);
};

Connector.isPlaying = () => {
	return Util.hasElementClass('.vjs-play-control', 'vjs-playing');
};

Connector.applyFilter(MetadataFilter.getYoutubeFilter());
