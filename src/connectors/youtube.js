'use strict';

/**
 * Array of categories allowed to be scrobbled.
 * @type {Array}
 */
const allowedCategories = [];

/**
 * "Video Id=Category" map.
 * @type {Map}
 */
const categoryCache = new Map();

/**
 * CSS selector of video element. It's common for both players.
 * @type {String}
 */
const videoSelector = '.html5-main-video';

const videoTitleSelector = '.html5-video-player .ytp-title-link';
const channelNameSelector = '#top-row .ytd-channel-name a';

// Dummy category indicates an actual category is being fetched
const categoryPending = 'YT_DUMMY_CATEGORY_PENDING';
// Fallback value in case when we cannot fetch a category.
const categoryUnknown = 'YT_DUMMY_CATEGORY_UNKNOWN';

const categoryMusic = 'Music';
const categoryEntertainment = 'Entertainment';

let currentVideoDescription = null;
let artistTrackFromDescription = null;

readConnectorOptions();
setupEventListener();

Connector.playerSelector = '#content';

Connector.getTrackInfo = () => {
	const trackInfo = getTrackInfoFromDescription();
	if (!Util.isArtistTrackEmpty(trackInfo)) {
		return trackInfo;
	}

	let { artist, track } = Util.processYtVideoTitle(
		Util.getTextFromSelectors(videoTitleSelector)
	);
	if (!artist) {
		artist = Util.getTextFromSelectors(channelNameSelector);
	}

	return { artist, track };
};

/*
 * Because player can be still present in the page, we need to detect
 * that it's invisible and don't return current time. Otherwise resulting
 * state may not be considered empty.
 */
Connector.getCurrentTime = () => {
	return getVideoProp('currentTime');
};

Connector.getDuration = () => {
	return getVideoProp('duration');
};

Connector.isPlaying = () => {
	return Util.hasElementClass('.html5-video-player', 'playing-mode');
};

Connector.getUniqueID = () => {
	/*
	 * ytd-watch-flexy element contains ID of a first played video
	 * if the miniplayer is visible, so we should check
	 * if URL of a current video in miniplayer is accessible.
	 */
	const miniPlayerVideoUrl = Util.getAttrFromSelectors('ytd-miniplayer[active] [selected] a', 'href');
	if (miniPlayerVideoUrl) {
		return Util.getYtVideoIdFromUrl(miniPlayerVideoUrl);
	}

	return Util.getAttrFromSelectors('ytd-watch-flexy', 'video-id');
};

Connector.isScrobblingAllowed = () => {
	if (document.querySelector('.ad-showing') !== null) {
		return false;
	}

	// FIXME: Workaround to prevent scrobbling the vidio opened in a background tab.
	if (Connector.getCurrentTime() < 1) {
		return false;
	}

	if (allowedCategories.length === 0) {
		return true;
	}

	const videoCategory = getVideoCategory(Connector.getUniqueID());
	if (!videoCategory) {
		return false;
	}

	if (videoCategory === categoryUnknown) {
		return true;
	}

	return allowedCategories.includes(videoCategory);
};

Connector.applyFilter(MetadataFilter.getYoutubeFilter());

function setupEventListener() {
	// TODO Add MutationObserver
	const videoElement = document.querySelector(videoSelector);
	if (videoElement) {
		videoElement.addEventListener('timeupdate', Connector.onStateChanged);
	}
}

function getVideoProp(prop) {
	const videoElement = document.querySelector(videoSelector);
	return videoElement && videoElement[prop];
}

/**
 * Get video category.
 * @param  {String} videoId Video ID
 * @return {String} Video category
 */
function getVideoCategory(videoId) {
	if (!videoId) {
		return null;
	}

	if (categoryCache.has(videoId)) {
		return categoryCache.get(videoId);
	}

	/*
	 * Add dummy category for videoId to prevent
	 * fetching category multiple times.
	 */
	categoryCache.set(videoId, categoryPending);

	fetchCategoryName(videoId)
		.then((category) => {
			console.log(`Fetched category for ${videoId}: ${category}`);
			categoryCache.set(videoId, category);
		})
		.catch((err) => {
			Util.debugLog(
				`Failed to fetch category for ${videoId}: ${err}`,
				'warn'
			);
			categoryCache.set(videoId, categoryUnknown);
		});

	return null;
}

async function fetchCategoryName(videoId) {
	const videoUrl = `https://youtube.com/watch?v=${videoId}`;

	try {
		/*
		 * Category info is not available via DOM API, so we should search it
		 * in a page source.
		 *
		 * But we cannot use `document.documentElement.outerHtml`, since it
		 * is not updated on video change.
		 */
		const response = await fetch(videoUrl);
		const rawHtml = await response.text();

		const categoryMatch = rawHtml.match(/"category":"(.+?)"/);
		if (categoryMatch !== null) {
			return categoryMatch[1];
		}
	} catch (e) {
		// Do nothing
	}

	return categoryUnknown;
}

/**
 * Asynchronously read connector options.
 */
async function readConnectorOptions() {
	if (await Util.getOption('YouTube', 'scrobbleMusicOnly')) {
		allowedCategories.push(categoryMusic);
	}
	if (await Util.getOption('YouTube', 'scrobbleEntertainmentOnly')) {
		allowedCategories.push(categoryEntertainment);
	}
	Util.debugLog(`Allowed categories: ${allowedCategories.join(', ')}`);
}

function getVideoDescription() {
	return Util.getTextFromSelectors('#description');
}

function getTrackInfoFromDescription() {
	const description = getVideoDescription();
	if (currentVideoDescription === description) {
		return artistTrackFromDescription;
	}

	currentVideoDescription = description;
	artistTrackFromDescription = Util.parseYtVideoDescription(description);

	return artistTrackFromDescription;
}
