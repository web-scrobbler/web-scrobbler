'use strict';

const CATEGORY_MUSIC = '10';
const CATEGORY_ENTERTAINMENT = '24';

/**
 * Array of categories allowed to be scrobbled.
 * @type {Array}
 */
let allowedCategories = [];

/**
 * "Video Id=Category" map.
 * @type {Map}
 */
let categoryCache = new Map();

/**
 * CSS selector of video element. It's common for both players.
 * @type {String}
 */
const videoSelector = '.html5-main-video';

/**
 * Youtube API key used to get video category.
 * @type {String}
 */
const YT_API_KEY = 'AIzaSyA3VNMxXEIr7Ml3_zUuzA7Ilba80A657KE';

readConnectorOptions();
setupMutationObserver();

Connector.getArtistTrack = () => {
	/*
	 * Youtube doesn't remove DOM object on AJAX navigation,
	 * so we should not return track data if no song is playing.
	 */
	if (Connector.isPlayerOffscreen()) {
		return Util.makeEmptyArtistTrack();
	}

	return getArtistTrack();
};

/**
 * Check if player is off screen.
 *
 * YouTube doesn't really unload the player. It simply moves it outside
 * viewport. That has to be checked, because our selectors are still able
 * to detect it.
 *
 * @return {Boolean} True if player is off screen; false otherwise
 */
Connector.isPlayerOffscreen = () => {
	if (Connector.isFullscreenMode()) {
		return false;
	}

	let videoElement = $(videoSelector);
	if (videoElement.length === 0) {
		return false;
	}

	let offset = videoElement.offset();
	return offset.left <= 0 && offset.top <= 0;
};

/*
 * Because player can be still present in the page, we need to detect
 * that it's invisible and don't return current time. Otherwise resulting
 * state may not be considered empty.
 */
Connector.getCurrentTime = () => {
	if (Connector.isPlayerOffscreen()) {
		return null;
	}
	return $(videoSelector).prop('currentTime');
};

Connector.getDuration = () => {
	if (Connector.isPlayerOffscreen()) {
		return null;
	}
	return $(videoSelector).prop('duration');
};

Connector.isPlaying = () => {
	return $('.html5-video-player').hasClass('playing-mode');
};

Connector.getUniqueID = () => {
	/*
	 * Youtube doesn't remove DOM object on AJAX navigation,
	 * so we should not return track data if no song is playing.
	 */
	if (Connector.isPlayerOffscreen()) {
		return null;
	}

	/*
	 * Youtube doesn't update video title immediately in fullscreen mode.
	 * We don't return video ID until video title is shown.
	 */
	if (Connector.isFullscreenMode()) {
		let videoTitle = $('.html5-video-player.playing-mode .ytp-title-link').text();
		if (!videoTitle) {
			return null;
		}
	}

	let videoUrl = $('.html5-video-player.playing-mode .ytp-title-link').attr('href');
	return Util.getYoutubeVideoIdFromUrl(videoUrl);
};

Connector.isScrobblingAllowed = () => {
	if ($('.videoAdUi').length > 0) {
		return false;
	}

	// FIXME: Workaround to prevent scrobbling the vidio opened in a background tab.
	if (Connector.getCurrentTime() < 1) {
		return false;
	}

	if (allowedCategories.length === 0) {
		return true;
	}

	let videoCategory = getVideoCategory(Connector.getUniqueID());
	if (videoCategory !== null) {
		return allowedCategories.includes(videoCategory);
	}

	return false;
};

Connector.filter = MetadataFilter.getYoutubeFilter();

Connector.isFullscreenMode = () => {
	return $('.html5-video-player').hasClass('ytp-fullscreen');
};

/**
 * @typedef {Object} ArtistTrack
 * @property {string} artist The track's artist
 * @property {string} track The track's title
 */

/**
 * Parse webpage and return track Artist and Title
 * @return {ArtistTrack} The track's Artist and Title
 */
function getArtistTrack() {
	let videoTitle = $('.html5-video-player.playing-mode .ytp-title-link').text();
	let byLineMatch = $('#meta-contents #owner-name a').text().match(/(.+) - Topic/);
	if (byLineMatch) {
		return { artist: byLineMatch[1], track: videoTitle };
	}
	return Util.processYoutubeVideoTitle(videoTitle);
}

/**
 * Get video category using Youtube API.
 * @param  {String} videoId Video ID
 * @return {String} Video category
 */
function getVideoCategory(videoId) {
	if (videoId === null) {
		return null;
	}
	if (!categoryCache.has(videoId)) {
		const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YT_API_KEY}`;
		fetch(url).then((response) => {
			if (!response.ok) {
				throw new Error('Invalid response');
			}
			return response.json();
		}).then((data) => {
			let category = data.items[0].snippet.categoryId;
			if (typeof category === 'string') {
				categoryCache.set(videoId, category);
			}
		}).catch((err) => {
			console.log(`Unable to get category for ${videoId}: ${err.message}`);
		});
		return null;
	}
	return categoryCache.get(videoId);

}

function setupMutationObserver() {
	let isEventListenerSetUp = false;

	function onMutation() {
		let videoElement = $(videoSelector);

		if (videoElement.length > 0) {
			if (!videoElement.is(':visible')) {
				Connector.resetState();
				return;
			}

			if (isEventListenerSetUp) {
				return;
			}

			videoElement.on('timeupdate', Connector.onStateChanged);
			isEventListenerSetUp = true;

			console.log('Web Scrobbler: Setup "timeupdate" event listener');
		} else {
			Connector.resetState();
			isEventListenerSetUp = false;

			console.warn('Web Scrobbler: Video element is missing');
		}
	}

	let observer = new MutationObserver(Util.throttle(onMutation, 500));
	observer.observe(document, {
		subtree: true,
		childList: true,
		attributes: false,
		characterData: false
	});
}

/**
 * Asynchronously read connector options.
 */
function readConnectorOptions() {
	chrome.storage.sync.get('Connectors', (data) => {
		if (data && data.Connectors && data.Connectors.YouTube) {
			let options = data.Connectors.YouTube;

			if (options.scrobbleMusicOnly) {
				allowedCategories.push(CATEGORY_MUSIC);
			}
			if (options.scrobbleEntertainmentOnly) {
				allowedCategories.push(CATEGORY_ENTERTAINMENT);
			}

			let optionsStr = JSON.stringify(options, null, 2);
			console.log(`Web Scrobbler: Connector options: ${optionsStr}`);
		}
	});
}
