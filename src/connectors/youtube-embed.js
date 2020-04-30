'use strict';

/**
 * Generic connector for YouTube embed videos.
 */

const videoSelector = '.html5-main-video';

function setupConnector() {
	const videoElement = document.querySelector(videoSelector);
	// Skip frames with no video element
	if (videoElement === null) {
		return;
	}

	videoElement.addEventListener('timeupdate', Connector.onStateChanged);

	Connector.getArtistTrack = () => {
		const videoTitle = Util.getTextFromSelectors('.ytp-title-link');
		return Util.processYtVideoTitle(videoTitle);
	};

	Connector.getCurrentTime = () => videoElement.currentTime;

	Connector.getDuration = () => videoElement.duration;

	Connector.isPlaying = () => {
		return Util.hasElementClass('.html5-video-player', 'playing-mode');
	};

	Connector.getUniqueID = () => {
		const videoUrl = Util.getAttrFromSelectors('.ytp-title-link', 'href');
		return Util.getYtVideoIdFromUrl(videoUrl);
	};

	Connector.applyFilter(MetadataFilter.getYoutubeFilter());
}

setupConnector();
