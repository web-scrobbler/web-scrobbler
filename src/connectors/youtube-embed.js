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

	videoElement.on('timeupdate', Connector.onStateChanged);

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

	Connector.applyFilter(MetadataFilter.getYoutubeFilter());
}

setupConnector();
