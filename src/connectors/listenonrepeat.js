'use strict';

Connector.playerSelector = '.player-controls';

Connector.filter = MetadataFilter.getYoutubeFilter();

Connector.getArtistTrack = () => {
	let text = $('.player-container > div > span:nth-child(2)').text();
	return Util.processYoutubeVideoTitle(text);
};

Connector.isPlaying = () => {
	return $('button:contains(Pause Video)').length > 0;
};
