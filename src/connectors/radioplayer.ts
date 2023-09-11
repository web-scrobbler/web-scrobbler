export {};

const artistSelector = '.playing-now .pod-title';
const trackSelector = '.playing-now .pod-desc';

Connector.playerSelector = '.radioplayer-head';

Connector.playButtonSelector = '#play';

// Priority: 1.
Connector.artistTrackSelector = ['.song-text', '.scrolling-text'];

// Priority: 2.
Connector.getTrackInfo = () => {
	const frame = document.querySelector(
		'#radiofeed_iframe',
	) as HTMLIFrameElement;
	const radioFeedFrame =
		frame.contentWindow?.document || frame.contentDocument;
	if (!radioFeedFrame) {
		return null;
	}

	const artist = radioFeedFrame.querySelector(artistSelector)?.textContent;
	const track = radioFeedFrame.querySelector(trackSelector)?.textContent;

	return { artist, track };
};
