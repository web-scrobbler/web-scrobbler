'use strict';

Connector.playerSelector = '#body-container';

Connector.getArtistTrack = () => {
	let videoTitle = $('.searchresult-title').first().text();
	return Util.processYoutubeVideoTitle(videoTitle);
};

Connector.isPlaying = () => $('#playpb').attr('src').includes('pause');
