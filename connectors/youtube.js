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

/**
 * Setup connector according to current Youtube design.
 * This function is called on connector inject.
 */
function setupConnector() {
	setupGeneralProperties();
	readConnectorOptions();

	if (isDefaultPlayer()) {

		if (isViewTubeInstalled()) {
			setupDefaultPlayer();
			applyViewTubeFixes();
		} else {
			setupBasePlayer();
			setupDefaultPlayer();
		}
	} else {
		setupBasePlayer();
		setupMaterialPlayer();
	}
}

/**
 * Check if default player on the page.
 * @return {Boolean} True if default player is on the page; false otherwise
 */
function isDefaultPlayer() {
	return $('ytd-app').length === 0;
}

/**
 * Check if ViewTube script is installed.
 * ViewTube script uses another player instead of Youtube default one.
 * @return {Boolean} True if ViewTube script is installed; false otherwise
 */
function isViewTubeInstalled() {
	return $('select[title]').length > 0;
}

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
	let videoTitle = $('.ytp-title-link').text();
	let byLineMatch = $('#meta-contents #owner-name a').text().match(/(.+) - Topic/);
	if (byLineMatch) {
		return { artist: byLineMatch[1], track: videoTitle };
	}
	return Util.processYoutubeVideoTitle(videoTitle);
}

/**
 * Setup default Youtube player.
 */
function setupDefaultPlayer() {
	Connector.getArtistTrack = () => {
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

		let $player = $('#player-api');
		if ($player.length === 0) {
			return false;
		}

		let offset = $player.offset();
		return offset.left < 0 || offset.top < 0;
	};
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

/**
 * Setup Material player.
 */
function setupMaterialPlayer() {
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
}

/**
 * Setup `isPlaying` function if ViewTube player is detected.
 */
function applyViewTubeFixes() {
	Connector.playerSelector = '#page';

	Connector.isPlaying = () => {
		return true;
	};

	Connector.getUniqueID = () => {
		let videoTitle = $('.ytp-title-link').text();
		if (!videoTitle) {
			return null;
		}

		let videoUrl = $('.ytp-title-link').attr('href');
		return Util.getYoutubeVideoIdFromUrl(videoUrl);
	};
}

/**
 * Setup common things for both players.
 */
function setupBasePlayer() {
	setupMutationObserver();

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
			let videoTitle = $('.ytp-title-link').text();
			if (!videoTitle) {
				return null;
			}
		}

		let videoUrl = $('.ytp-title-link').attr('href');
		return Util.getYoutubeVideoIdFromUrl(videoUrl);
	};

	Connector.isScrobblingAllowed = () => {
		if ($('.videoAdUi').length > 0) {
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
}

function setupGeneralProperties() {
	Connector.filter = MetadataFilter.getYoutubeFilter();

	Connector.isFullscreenMode = () => {
		return $('.html5-video-player').hasClass('ytp-fullscreen');
	};
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

setupConnector();
