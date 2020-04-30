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
	const iframe = document.getElementById('radiofeed_iframe');
	if (!iframe) {
		return null;
	}

	const radioFeedFrame = iframe.contentDocument || iframe.contentWindow.document;

	const artistItem = radioFeedFrame.querySelector(artistSelector);
	const trackItem = radioFeedFrame.querySelector(trackSelector);

	const artist = artistItem && artistItem.textContent || null;
	const track = trackItem && trackItem.textContent || null;

	return { artist, track };
};
