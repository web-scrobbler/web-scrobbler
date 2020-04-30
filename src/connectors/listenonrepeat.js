'use strict';

const playButtonSelector = '.controls button:nth-child(3)';

Connector.playerSelector = '#app-root';

Connector.applyFilter(MetadataFilter.getYoutubeFilter());

Connector.getArtistTrack = () => {
	const text = Util.getAttrFromSelectors('meta[name="twitter:title"]', 'content');
	return Util.processYtVideoTitle(text);
};

Connector.isPlaying = () => {
	return Util.getTextFromSelectors(playButtonSelector) === 'Pause Video';
};
