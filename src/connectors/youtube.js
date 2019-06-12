'use strict';

const CATEGORY_MUSIC = '/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ';
const CATEGORY_ENTERTAINMENT = '/channel/UCi-g4cjqGV7jvU8aeSuj0jQ';

const CATEGORY_PENDING = 'YT_DUMMY_CATEGORY_PENDING';

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

readConnectorOptions();
setupMutationObserver();

Connector.getArtistTrack = () => {
	const videoTitle = $('.html5-video-player .ytp-title-link').first().text();
	const byLineMatch = $('#meta-contents #owner-name a').text().match(/(.+) - Topic/);
	if (byLineMatch) {
		return { artist: byLineMatch[1], track: videoTitle };
	}

	let { artist, track } = Util.processYoutubeVideoTitle(videoTitle);
	if (!artist) {
		artist = $('#meta-contents #owner-name').text();
	}

	return { artist, track };
};

/*
 * Because player can be still present in the page, we need to detect
 * that it's invisible and don't return current time. Otherwise resulting
 * state may not be considered empty.
 */
Connector.getCurrentTime = () => {
	return $(videoSelector).prop('currentTime');
};

Connector.getDuration = () => {
	return $(videoSelector).prop('duration');
};

Connector.isPlaying = () => {
	return $('.html5-video-player').hasClass('playing-mode');
};

Connector.getUniqueID = () => {
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

	let videoId = $('ytd-watch-flexy').attr('video-id');

	if (!videoId) {
		let videoUrl = $('.html5-video-player.playing-mode .ytp-title-link').attr('href');
		videoId = Util.getYoutubeVideoIdFromUrl(videoUrl);
	}

	return videoId;
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

Connector.applyFilter(MetadataFilter.getYoutubeFilter());

Connector.isFullscreenMode = () => {
	return $('.html5-video-player').hasClass('ytp-fullscreen');
};

/**
 * Get video category.
 * @param  {String} videoId Video ID
 * @return {String} Video category
 */
function getVideoCategory(videoId) {
	if (videoId === null) {
		return null;
	}

	if (!categoryCache.has(videoId)) {
		/*
		 * Add dummy category for videoId to prevent
		 * fetching category multiple times.
		 */
		categoryCache.set(videoId, CATEGORY_PENDING);

		fetchCategoryId(videoId).then((category) => {
			if (category === null) {
				Util.debugLog(`Failed to resolve category for ${videoId}`, 'warn');
			}

			categoryCache.set(videoId, category);
		});

		return null;
	}

	return categoryCache.get(videoId);
}

async function fetchCategoryId() {
	await fillMoreSection();
	return $('.ytd-metadata-row-renderer .yt-formatted-string[href^="/channel/"]').attr('href');
}

async function fillMoreSection() {
	function waitForClick(ms = 0) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	const ytShowLessText = $('yt-formatted-string.less-button').text();
	const ytShowMoreText = $('yt-formatted-string.more-button').text();

	// Apply global style to prevent "More/Less" button flickering.
	$('yt-formatted-string.less-button').text(ytShowMoreText);
	let styleTag = $(`
		<style id="tmp-style">
			ytd-metadata-row-container-renderer {
				visibility: hidden;
			}
			ytd-metadata-row-container-renderer #collapsible {
				height: 0;
			}
			ytd-expander > #content.ytd-expander {
				overflow: hidden;
				max-height: var(--ytd-expander-collapsed-height);
			}
			yt-formatted-string.less-button {
				margin-top: 0 !important;
			}
		</style>
	`);
	$('html > head').append(styleTag);

	// Open "More" section.
	$('yt-formatted-string.more-button').click();
	await waitForClick();

	// Close "More" section.
	$('yt-formatted-string.less-button').click();

	// Remove global style.
	$('yt-formatted-string.less-button').text(ytShowLessText);
	$('#tmp-style').remove();
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

			Util.debugLog('Setup "timeupdate" event listener');
		} else {
			Connector.resetState();
			isEventListenerSetUp = false;

			Util.debugLog('Video element is missing', 'warn');
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
async function readConnectorOptions() {
	if (await Util.getOption('YouTube', 'scrobbleMusicOnly')) {
		allowedCategories.push(CATEGORY_MUSIC);
	}
	if (await Util.getOption('YouTube', 'scrobbleEntertainmentOnly')) {
		allowedCategories.push(CATEGORY_ENTERTAINMENT);
	}
}
