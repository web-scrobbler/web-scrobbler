'use strict';

Connector.playerSelector = '.community__bottom';

Connector.artistTrackSelector = '.bottom__playback-meta .community__playback-meta--desktop .community__song-playing';

Connector.applyFilter(MetadataFilter.getYoutubeFilter());

Connector.isPlaying = () => {
	return Util.getAttrFromSelectors('.community', 'data-state') === 'playing';
};
