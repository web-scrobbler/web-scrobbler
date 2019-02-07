'use strict';

Connector.playerSelector = '.player-controls';

Connector.filter = MetadataFilter.getYoutubeFilter();

Connector.getArtistTrack = () => {
	const text = $('meta[name="twitter:title"]').attr('content');
	return Util.processYoutubeVideoTitle(text);
};

Connector.isPlaying = () => {
	return $('button:contains(Pause Video)').length > 0;
};
