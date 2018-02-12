'use strict';

const videoIdRegExp = /v=?([^#&?]*).*/;

Connector.playerSelector = '.player-controls';

Connector.filter = MetadataFilter.getYoutubeFilter();

Connector.getArtistTrack = () => {
	let text = $('.player-container > div > span:nth-child(2)').text();
	return Util.processYoutubeVideoTitle(text);
};

Connector.isPlaying = () => {
	return $('button:contains(Pause Video)').length > 0;
};

Connector.getUniqueID = () => {
	let videoUrl = $('meta[property="og:url"]').attr('content');
	return getYoutubeVideoIdFromUrl(videoUrl);
};

function getYoutubeVideoIdFromUrl(videoUrl) {
	let match = videoUrl.match(videoIdRegExp);
	if (match) {
		return match[1];
	}

	return null;
}
