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

/**
 * DOM-based category fetching.
 */

// Dummy category indicates an actual category is being fetched
const CATEGORY_PENDING = 'YT_DUMMY_CATEGORY_PENDING';
// Fallback value in case when we cannot fetch a category.
const CATEGORY_UNKNOWN = 'YT_DUMMY_CATEGORY_UNKNOWN';

const CATEGORY_MUSIC = '/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ';
const CATEGORY_ENTERTAINMENT = '/channel/UCi-g4cjqGV7jvU8aeSuj0jQ';

const CATEGORIES = [
	'/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ', // Music
	'/channel/UCi-g4cjqGV7jvU8aeSuj0jQ', // Entertainment
	'/channel/UCDbM8yVukVKPWUQSODaw_Mw', // Sports
	'/channel/UCEgdi0XIXXZ-qJOFPf4JSKw', // Comedy
	'/channel/UC1vGae2Q3oT5MkhhfW8lwjg', // Howto & Style / People & Blogs
	'/channel/UCFYJCBaHRzLJrnhRglM3GdA', // Pets & Animals
	'/channel/UCYfdidRxbB8Qhf0Nx7ioOYw', // News & Politics
	'/channel/UCHiJaXgDo_JnsfOmSe-HgzA', // Auto & Vehicles
	'/channel/UCxAgnFbkxldX6YUEvdcNjnA', // Film & Animation
	'/channel/UCiDF_uaU1V00dAc8ddKvNxA', // Science & Technology
	'/channel/UCM6FFmRAK_uTICRwyTubV0A', // Nonprofits & Activism
	'/channel/UCUrY9QznFi4-S3jWihvaBpA', // Travel & Events
	'/gaming',
	'/learning',
];

const ytFormattedString = '.ytd-metadata-row-renderer .yt-formatted-string';
const gamingSelector = `${ytFormattedString}[href^="/gaming"]`;
const learningSelector = `${ytFormattedString}[href^="/learning"]`;
const genericCatSelector = `${ytFormattedString}[href^="/channel/"]`;

const categorySelectors = [
	gamingSelector, learningSelector, genericCatSelector,
];

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
	 * ytd-watch-flexy element contains ID of a first played video
	 * if the miniplayer is visible, so we should check
	 * if URL of a current video in miniplayer is accessible.
	 */
	const miniPlayerVideoUrl = $('ytd-miniplayer[active] [selected] a').attr('href');
	if (miniPlayerVideoUrl) {
		return Util.getYtVideoIdFromUrl(miniPlayerVideoUrl);
	}

	return $('ytd-watch-flexy').attr('video-id');
};

Connector.isScrobblingAllowed = () => {
	if ($('.ad-showing').length > 0) {
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

	if (videoCategory === CATEGORY_UNKNOWN) {
		return true;
	}

	return allowedCategories.includes(videoCategory);
};

Connector.applyFilter(MetadataFilter.getYoutubeFilter());

function setupEventListener() {
	$(videoSelector).on('timeupdate', Connector.onStateChanged);
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
	categoryCache.set(videoId, CATEGORY_PENDING);

	fetchCategoryId().then((category) => {
		console.log(`Fetched category for ${videoId}: ${category}`);
		categoryCache.set(videoId, category);
	}).catch((err) => {
		Util.debugLog(`Failed to fetch category for ${videoId}: ${err}`, 'warn');
		categoryCache.set(videoId, CATEGORY_UNKNOWN);
	});

	return null;
}

async function fetchCategoryId() {
	await fillMoreSection();

	let ytChannelUrls = [];
	for (const selector of categorySelectors) {
		ytChannelUrls = $(selector);
		if (ytChannelUrls.length > 0) {
			break;
		}
	}

	if (ytChannelUrls.length === 0) {
		return CATEGORY_UNKNOWN;
	} else if (ytChannelUrls.length === 1) {
		return ytChannelUrls.attr('href');
	}
	for (const data of ytChannelUrls) {
		const ytChannelUrl = $(data).attr('href');
		if (CATEGORIES.includes(ytChannelUrl)) {
			return ytChannelUrl;
		}
	}

	return CATEGORY_UNKNOWN;
}

async function fillMoreSection() {
	function waitForClick(ms = 0) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	const ytShowLessText = $('yt-formatted-string.less-button').text();
	const ytShowMoreText = $('yt-formatted-string.more-button').text();

	// Apply global style to prevent "More/Less" button flickering.
	$('yt-formatted-string.less-button').text(ytShowMoreText);
	const styleTag = $(`
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
	Util.debugLog(`Allowed categories: ${allowedCategories.join(', ')}`);
}

function getVideoDescription() {
	return $('#description').text();
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
