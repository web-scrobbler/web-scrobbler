'use strict';

Connector.playerSelector = '#app-root';

Connector.applyFilter(MetadataFilter.getYoutubeFilter());

Connector.getArtistTrack = () => {
	const text = $('meta[name="twitter:title"]').attr('content');
	return Util.processYtVideoTitle(text);
};

Connector.pauseButtonSelector = 'button:contains(Pause Video)';
