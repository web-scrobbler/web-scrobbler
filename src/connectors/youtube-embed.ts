'use strict';

/**
 * Generic connector for Youtube embed videos.
 */

/**
 * CSS selector of video element.
 * @type {String}
 */
const VIDEO_SELECTOR = '.html5-main-video';

function getVideoUrl() {
	return $('.ytp-title-link').attr('href');
}

function getVideoId() {
	const videoUrl = getVideoUrl();

	return Util.getYtVideoIdFromUrl(videoUrl);
}

function setupConnector() {
	const videoElement = $(VIDEO_SELECTOR);
	// Skip frames with no video element
	if (videoElement.length === 0) {
		return;
	}

	videoElement.on('timeupdate', Connector.onStateChanged);

	Connector.getArtistTrack = () => {
		const videoTitle = $('.ytp-title-link').text();
		return Util.processYtVideoTitle(videoTitle);
	};

	Connector.getCurrentTime = () => videoElement.prop('currentTime');

	Connector.getDuration = () => videoElement.prop('duration');

	Connector.isPlaying = () => {
		return $('.html5-video-player').hasClass('playing-mode');
	};

	Connector.getOriginUrl = () => {
		const videoId = getVideoId();

		return `https://youtu.be/${videoId}`;
	};

	Connector.getUniqueID = () => {
		return getVideoId();
	};

	Connector.applyFilter(MetadataFilter.getYoutubeFilter());
}

setupConnector();
