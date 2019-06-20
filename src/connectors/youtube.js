'use strict';

const CATEGORY_MUSIC = '/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ';
const CATEGORY_SPORTS = '/channel/UCDbM8yVukVKPWUQSODaw_Mw';
const CATEGORY_COMEDY = '/channel/UCEgdi0XIXXZ-qJOFPf4JSKw';
const CATEGORY_ENTERTAINMENT = '/channel/UCi-g4cjqGV7jvU8aeSuj0jQ';
const CATEGORY_HOWTO_AND_STYLE = '/channel/UC1vGae2Q3oT5MkhhfW8lwjg';
const CATEGORY_NEWS_AND_POLITICS = '/channel/UCYfdidRxbB8Qhf0Nx7ioOYw';
const CATEGORY_FILM_AND_ANIMATION = '/channel/UCxAgnFbkxldX6YUEvdcNjnA';
const CATEGORY_SCIENCE_AND_TECHNOLOGY = '/channel/UCiDF_uaU1V00dAc8ddKvNxA';

const CATEGORY_PENDING = 'YT_DUMMY_CATEGORY_PENDING';

const CATEGORIES = [
	CATEGORY_MUSIC,
	CATEGORY_SPORTS,
	CATEGORY_COMEDY,
	CATEGORY_ENTERTAINMENT,
	CATEGORY_HOWTO_AND_STYLE,
	CATEGORY_NEWS_AND_POLITICS,
	CATEGORY_FILM_AND_ANIMATION,
	CATEGORY_SCIENCE_AND_TECHNOLOGY
];

// Basic support for languages the extension is traslated to.
// TODO: Remove if description parsing is implemented.
const TOPIC_SUFFIXES = [
	/(.+) - Topic/, // EN
	/(.+) – Thema/, // DE
	/(.+) – тема/, // RU
	/(.+) - Tema/, // ES
	/(.+) – temat/, // PL
	/(.+) – Tópico/, // PT
];

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

const videoTitleSelector = '.html5-video-player .ytp-title-link';
const channelNameSelector = '#top-row .ytd-channel-name a';

let currentVideoDescription = null;
let artistTrackFromDescription = null;

readConnectorOptions();

Connector.playerSelector = '#content';

Connector.getArtistTrack = () => {
	const artistTrack = getArtistTrackFromDescription();
	if (!Util.isArtistTrackEmpty(artistTrack)) {
		return artistTrack;
	}

	let { artist, track } = Util.processYoutubeVideoTitle(
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
		return Util.getYoutubeVideoIdFromUrl(miniPlayerVideoUrl);
	}

	return $('ytd-watch-flexy').attr('video-id');
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

	const videoId = Connector.getUniqueID();
	if (videoId) {
		const videoCategory = getVideoCategory(videoId);
		if (videoCategory !== null) {
			return allowedCategories.includes(videoCategory);
		}

		return false;
	}

	return true;
};

Connector.applyFilter(
	MetadataFilter.getYoutubeFilter().append({
		artist: removeTopicSuffix,
	})
);

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

function removeTopicSuffix(text) {
	for (const regex of TOPIC_SUFFIXES) {
		const topicMatch = text.match(regex);
		if (topicMatch) {
			return topicMatch[1];
		}
	}

	return text;
}

async function fetchCategoryId() {
	await fillMoreSection();

	const ytChannelUrls =
		$('.ytd-metadata-row-renderer .yt-formatted-string[href^="/channel/"]');
	if (ytChannelUrls.length === 1) {
		return ytChannelUrls.attr('href');
	}

	for (const data of ytChannelUrls) {
		const ytChannelUrl = $(data).attr('href');
		if (CATEGORIES.includes(ytChannelUrl)) {
			return ytChannelUrl;
		}
	}

	throw new Error('The video has no category URL!');
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

function getVideoDescription() {
	return $('#description').text();
}

function getArtistTrackFromDescription() {
	const description = getVideoDescription();
	if (currentVideoDescription === description) {
		return artistTrackFromDescription;
	}

	currentVideoDescription = description;
	artistTrackFromDescription = getArtistTrackFromYouTubeDescription(description);

	return artistTrackFromDescription;
}

// TODO: Move parser code to Util module.

const LINE_ARTIST_TRACK = 0;
const LINE_ALBUM = 1;

const descFirstLine = 'Provided to YouTube';
const descLastLine = 'Auto-generated by YouTube.';

const descArtistTrackSeparator = '·';

function isValidYouTubeDescription(desc) {
	return desc && (
		desc.startsWith(descFirstLine) ||
		desc.endsWith(descLastLine)
	);
}

function getArtistTrackFromYouTubeDescription(desc) {
	if (!isValidYouTubeDescription(desc)) {
		return Util.makeEmptyArtistTrack();
	}

	let indexOffset = 0;
	const lines = desc.split('\n').filter((line) => line.length > 0);
	if (lines[0].startsWith(descFirstLine)) {
		indexOffset = 1;
	}

	const { artist, track } = Util.splitArtistTrack(
		lines[LINE_ARTIST_TRACK + indexOffset],
		descArtistTrackSeparator, { swap: true }
	);
	const album = lines[LINE_ALBUM + indexOffset];

	return { artist, track, album };
}
