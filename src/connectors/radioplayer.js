'use strict';

const artistSelector = '.playing-now .pod-title';
const trackSelector = '.playing-now .pod-desc';

Connector.playerSelector = '.radioplayer-head';

Connector.playButtonSelector = '#play';

// Priority: 1.
Connector.artistTrackSelector = [
	'.song-text', '.scrolling-text',
];

// Priority: 2.
Connector.getTrackInfo = () => {
	const radioFeedFrame = $('#radiofeed_iframe').contents();
	if (radioFeedFrame.length === 0) {
		return null;
	}

	const artist = radioFeedFrame.find(artistSelector).text();
	const track = radioFeedFrame.find(trackSelector).text();

	return { artist, track };
};
