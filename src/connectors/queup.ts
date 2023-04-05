export {};

Connector.playerSelector = '.infoContainer';

Connector.getArtistTrack = () => {
	const ytVideoTitle = Util.getTextFromSelectors('.currentSong');
	const { artist, track } = Util.processYtVideoTitle(ytVideoTitle);

	return { artist, track };
};

Connector.applyFilter(MetadataFilter.createYouTubeFilter());
