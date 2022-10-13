'use strict';

/**
 * Quick links to debug and test the connector:
 *
 * https://www.youtube.com/watch?v=WA3hL4hDx9c - auto-generated music video
 * The connector should get info via `getTrackInfoFromDescription` function
 *
 * https://www.youtube.com/watch?v=eYLbteOm42k - video with chapters available
 * The connector should get info via `getTrackInfoFromChapters` function
 *
 * https://www.youtube.com/watch?v=mHnC_vELJsk - regular video
 * The connector should get info via `getTrackInfoFromTitle` function
 */

/**
 * CSS selector of video element. It's common for both players.
 * @type {String}
 */
const videoSelector = '.html5-main-video';

const chapterNameSelector = '.html5-video-player .ytp-chapter-title-content';
const videoTitleSelector = '.html5-video-player .ytp-title-link';
const channelNameSelector = '#top-row .ytd-channel-name a';
const videoDescriptionSelector = '#meta-contents #description';

// Dummy category indicates an actual category is being fetched
const categoryPending = 'YT_DUMMY_CATEGORY_PENDING';
// Fallback value in case when we cannot fetch a category.
const categoryUnknown = 'YT_DUMMY_CATEGORY_UNKNOWN';

const categoryMusic = 'Music';
const categoryEntertainment = 'Entertainment';

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

let currentVideoDescription = null;
let artistTrackFromDescription = null;

const trackInfoGetters = [
	getTrackInfoFromChapters,
	getTrackInfoFromDescription,
	getTrackInfoFromTitle,
];

readConnectorOptions();
setupEventListener();

Connector.playerSelector = '#content';

Connector.getTrackInfo = () => {
	const trackInfo = {};

	for (const getter of trackInfoGetters) {
		const currentTrackInfo = getter();
		if (!currentTrackInfo) {
			continue;
		}

		if (!trackInfo.artist) {
			trackInfo.artist = currentTrackInfo.artist;
		}

		if (!trackInfo.track) {
			trackInfo.track = currentTrackInfo.track;
		}

		if (!Util.isArtistTrackEmpty(trackInfo)) {
			break;
		}
	}

	return trackInfo;
};

Connector.getTimeInfo = () => {
	const videoElement = document.querySelector(videoSelector);
	if (videoElement && !areChaptersAvailable()) {
		let { currentTime, duration, playbackRate } = videoElement;

		currentTime /= playbackRate;
		duration /= playbackRate;

		return { currentTime, duration };
	}

	return null;
};

Connector.isPlaying = () => {
	return $('.html5-video-player').hasClass('playing-mode');
};

Connector.getOriginUrl = () => {
	const videoId = getVideoId();

	return `https://youtu.be/${videoId}`;
};

Connector.getUniqueID = () => {
	if (areChaptersAvailable()) {
		return null;
	}

	return getVideoId();
};

Connector.isScrobblingAllowed = () => {
	if ($('.ad-showing').length > 0) {
		return false;
	}

	// Workaround to prevent scrobbling the video opened in a background tab.
	if (!isVideoStartedPlaying()) {
		return false;
	}

	return isVideoCategoryAllowed();
};

Connector.applyFilter(
	MetadataFilter.getYoutubeFilter().append({
		artist: [removeLtrRtlChars, removeNumericPrefix],
		track: [removeLtrRtlChars, removeNumericPrefix],
	})
);

function setupEventListener() {
	$(videoSelector).on('timeupdate', Connector.onStateChanged);
}

function areChaptersAvailable() {
	const text = Util.getTextFromSelectors(chapterNameSelector);

	// SponsorBlock extension hijacks chapter element. Ignore it.
	if (document.querySelector('.ytp-chapter-title-content.sponsorBlock-segment-title')) {
		return false;
	}

	// Return the text if no sponsorblock text.
	return text;
}

function getVideoId() {
	/*
	 * ytd-watch-flexy element contains ID of a first played video
	 * if the miniplayer is visible, so we should check
	 * if URL of a current video in miniplayer is accessible.
	 */
	const miniPlayerVideoUrl = Util.getAttrFromSelectors(
		'ytd-miniplayer[active] [selected] a',
		'href'
	);
	if (miniPlayerVideoUrl) {
		return Util.getYtVideoIdFromUrl(miniPlayerVideoUrl);
	}

	return Util.getAttrFromSelectors('ytd-watch-flexy', 'video-id');
}

function getVideoCategory() {
	const videoId = getVideoId();

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
			Util.debugLog(`Fetched category for ${videoId}: ${category}`);
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
	/*
	 * We cannot use `location.href`, since it could miss the video URL
	 * in case when YouTube mini player is visible.
	 */
	const videoUrl = `${location.origin}/watch?v=${videoId}`;

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
	return Util.getTextFromSelectors(videoDescriptionSelector);
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

function getTrackInfoFromChapters() {

	// Short circuit if chapters not available - necessary to avoid misscrobbling with SponsorBlock.
	if (!areChaptersAvailable()) {
		return {
			artist: null,
			track: null,
		};
	}

	const chapterName = Util.getTextFromSelectors(chapterNameSelector);
	const artistTrack = Util.processYtVideoTitle(chapterName);
	if (!artistTrack.track) {
		artistTrack.track = chapterName;
	}
	return artistTrack;
}

function getTrackInfoFromTitle() {
	let { artist, track } = Util.processYtVideoTitle(
		Util.getTextFromSelectors(videoTitleSelector)
	);
	if (!artist) {
		artist = Util.getTextFromSelectors(channelNameSelector);
	}

	return { artist, track };
}

function removeLtrRtlChars(text) {
	return MetadataFilter.filterWithFilterRules(text, [
		{ source: /\u200e/g, target: '' },
		{ source: /\u200f/g, target: '' },
	]);
}

function removeNumericPrefix(text) {
	return MetadataFilter.filterWithFilterRules(text, [
		// `NN.` or `NN)`
		{ source: /^\d{1,2}[.)]\s?/, target: '' },
		/*
		 * `(NN).` Ref: https://www.youtube.com/watch?v=KyabZRQeQgk
		 * NOTE Initial tracklist format is (NN)  dd:dd  Artist - Track
		 * YouTube adds a dot symbol after the numeric prefix.
		 */
		{ source: /^\(\d{1,2}\)\./, target: '' },
	]);
}

function isVideoStartedPlaying() {
	const videoElement = document.querySelector(videoSelector);
	return videoElement && videoElement.currentTime > 0;
}

function isVideoCategoryAllowed() {
	if (allowedCategories.length === 0) {
		return true;
	}

	const videoCategory = getVideoCategory();
	if (!videoCategory) {
		return false;
	}

	return (
		allowedCategories.includes(videoCategory) ||
		videoCategory === categoryUnknown
	);
}
