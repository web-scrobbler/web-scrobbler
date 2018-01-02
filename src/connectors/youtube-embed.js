'use strict';

/**
 * Generic connector for Youtube embed videos.
 */

/**
 * CSS selector of video element.
 * @type {String}
 */
const VIDEO_SELECTOR = '.html5-main-video';

function setupConnector() {
	let videoElement = $(VIDEO_SELECTOR);
	// Skip frames with no video element
	if (videoElement.length === 0) {
		return;
	}

	Connector.getArtistTrack = () => {
		let videoTitle = $('.ytp-title-link').text();
		return Util.processYoutubeVideoTitle(videoTitle);
	};

	Connector.getCurrentTime = () => videoElement.prop('currentTime');

	Connector.getDuration = () => videoElement.prop('duration');

	Connector.isPlaying = () => {
		return $('.html5-video-player').hasClass('playing-mode');
	};

	Connector.getUniqueID = () => {
		let videoUrl = $('.ytp-title-link').attr('href');
		return Util.getYoutubeVideoIdFromUrl(videoUrl);
	};

	Connector.filter = MetadataFilter.getYoutubeFilter();

	setupMutationObserver();
}

function setupMutationObserver() {
	let observer = new MutationObserver(() => {
		let videoElement = $(VIDEO_SELECTOR);

		if (videoElement.length > 0) {
			videoElement.on('timeupdate', Connector.onStateChanged);
			observer.disconnect();

			console.log('Web Scrobbler: Setup "timeupdate" event listener');
		}
	});
	observer.observe(document, {
		subtree: true,
		childList: true,
		attributes: false,
		characterData: false
	});
}

setupConnector();
