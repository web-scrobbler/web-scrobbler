export {};

Connector.playerSelector = '#player';

Connector.artistTrackSelector = 'h1';

Connector.currentTimeSelector = '.vjs-current-time-display';

Connector.durationSelector = '.vjs-duration-display';

Connector.getArtistTrack = () => {
	const text = Util.getTextFromSelectors(Connector.artistTrackSelector);
	return Util.processYtVideoTitle(text);
};

Connector.getUniqueID = () => {
	const videoUrl = Util.getAttrFromSelectors('h1 a', 'href');
	return Util.getYtVideoIdFromUrl(videoUrl);
};

Connector.isPlaying = () =>
	Util.hasElementClass('.vjs-play-control', 'vjs-playing');

Connector.applyFilter(MetadataFilter.createYouTubeFilter());
