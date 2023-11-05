export {};

Connector.playerSelector = '.community__bottom';

Connector.artistTrackSelector =
	'.bottom__playback-meta .community__playback-meta--desktop .community__song-playing';

Connector.applyFilter(MetadataFilter.createYouTubeFilter());

Connector.isPlaying = () => {
	return Util.getDataFromSelectors('.community', 'state') === 'playing';
};
