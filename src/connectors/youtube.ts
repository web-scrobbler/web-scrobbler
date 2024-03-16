import type { ArtistTrackInfo, TrackInfoWithAlbum } from '@/core/types';

export {};

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
 */
const videoSelector = '.html5-main-video';

const chapterNameSelector = '.html5-video-player .ytp-chapter-title-content';
const videoTitleSelector = [
	'.html5-video-player .ytp-title-link',
	'.slim-video-information-title .yt-core-attributed-string',
];
const channelNameSelector = [
	'#top-row .ytd-channel-name a',
	'.slim-owner-channel-name .yt-core-attributed-string',
];
const videoDescriptionSelector = [
	'#description.ytd-expandable-video-description-body-renderer',
	'#meta-contents #description',
	'.crawler-full-description',
];

// Dummy category indicates an actual category is being fetched
const categoryPending = 'YT_DUMMY_CATEGORY_PENDING';
// Fallback value in case when we cannot fetch a category.
const categoryUnknown = 'YT_DUMMY_CATEGORY_UNKNOWN';

const categoryMusic = 'Music';
const categoryEntertainment = 'Entertainment';

/**
 * Array of categories allowed to be scrobbled.
 */
const allowedCategories: string[] = [];

/**
 * "Video Id=Category" map.
 */
const categoryCache = new Map<string, string>();

/**
 * Wether we should only scrobble music recognised by YouTube Music
 */
let scrobbleMusicRecognisedOnly = false;

/**
 * Wether the Youtube Music track info getter is enabled
 */
let getTrackInfoFromYtMusicEnabled = false;

let currentVideoDescription: string | null = null;
let artistTrackFromDescription: TrackInfoWithAlbum | null = null;

const getTrackInfoFromYoutubeMusicCache: {
	[videoId: string]: {
		done?: boolean;
		recognisedByYtMusic?: boolean;
		videoId?: string | null;
		currentTrackInfo?: { artist?: string; track?: string };
	};
} = {};

const trackInfoGetters: (() =>
	| ArtistTrackInfo
	| null
	| undefined
	| Record<string, never>
	| TrackInfoWithAlbum)[] = [
	getTrackInfoFromChapters,
	getTrackInfoFromYoutubeMusic,
	getTrackInfoFromDescription,
	getTrackInfoFromTitle,
];

readConnectorOptions();
setupEventListener();

Connector.playerSelector = ['#content', '#player'];

Connector.scrobbleInfoLocationSelector = '#primary #title.ytd-watch-metadata';
Connector.scrobbleInfoStyle = {
	...Connector.scrobbleInfoStyle,
	fontSize: '1.17em',
	fontWeight: '700',
};

Connector.loveButtonSelector =
	'ytd-watch-metadata like-button-view-model button[aria-pressed="false"]';

Connector.unloveButtonSelector =
	'ytd-watch-metadata like-button-view-model button[aria-pressed="true"]';

Connector.getChannelId = () =>
	new URL(
		(
			Util.queryElements([
				'#upload-info .ytd-channel-name .yt-simple-endpoint',
				'.slim-owner-icon-and-title',
			]) as NodeListOf<HTMLAnchorElement>
		)?.[0]?.href ?? 'https://youtube.com/',
	).pathname.slice(1);

Connector.channelLabelSelector = [
	'#primary #title+#top-row ytd-channel-name .yt-formatted-string',
	'.slim-owner-icon-and-title .yt-core-attributed-string',
];

Connector.getTrackInfo = () => {
	const trackInfo: TrackInfoWithAlbum = {};

	if (getTrackInfoFromYtMusicEnabled) {
		const videoId = getVideoId();
		if (!getTrackInfoFromYoutubeMusicCache[videoId ?? '']) {
			// start loading getTrackInfoFromYoutubeMusic
			getTrackInfoFromYoutubeMusic();

			// wait for getTrackInfoFromYoutubeMusic to finish
			return trackInfo;
		}
	}

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

		if (!trackInfo.album && 'album' in currentTrackInfo) {
			trackInfo.album = currentTrackInfo.album;
		}

		if (!Util.isArtistTrackEmpty(trackInfo)) {
			break;
		}
	}

	return trackInfo;
};

Connector.getTimeInfo = () => {
	const videoElement = document.querySelector(
		videoSelector,
	) as HTMLVideoElement;
	if (videoElement && !areChaptersAvailable()) {
		let { currentTime, duration, playbackRate } = videoElement;

		currentTime /= playbackRate;
		duration /= playbackRate;

		return { currentTime, duration };
	}

	return null;
};

Connector.isPlaying = () => {
	return Util.hasElementClass('.html5-video-player', 'playing-mode');
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

Connector.scrobblingDisallowedReason = () => {
	if (document.querySelector('.ad-showing')) {
		return 'IsAd';
	}

	// Workaround to prevent scrobbling the video opened in a background tab.
	if (!isVideoStartedPlaying()) {
		return 'Other';
	}

	if (scrobbleMusicRecognisedOnly) {
		const videoId = getVideoId();
		const ytMusicCache = getTrackInfoFromYoutubeMusicCache[videoId ?? ''];

		if (!ytMusicCache) {
			// start loading getTrackInfoFromYoutubeMusic
			getTrackInfoFromYoutubeMusic();
			return 'IsLoading';
		}

		if (!ytMusicCache.done) {
			// not done loading yet
			return 'IsLoading';
		}

		if (!ytMusicCache.recognisedByYtMusic) {
			// not recognised!
			return 'NotOnYouTubeMusic';
		}
	}

	return isVideoCategoryAllowed() ? null : 'ForbiddenYouTubeCategory';
};

Connector.applyFilter(
	MetadataFilter.createYouTubeFilter().append({
		artist: [removeLtrRtlChars, removeNumericPrefix],
		track: [removeLtrRtlChars, removeNumericPrefix],
	}),
);

function setupEventListener() {
	document
		.querySelector(videoSelector)
		?.addEventListener('timeupdate', Connector.onStateChanged);
}

function areChaptersAvailable() {
	const text = Util.getTextFromSelectors(chapterNameSelector);

	// SponsorBlock extension hijacks chapter element. Ignore it.
	if (
		document.querySelector(
			'.ytp-chapter-title-content.sponsorBlock-segment-title',
		)
	) {
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
		'href',
	);
	if (miniPlayerVideoUrl) {
		return Util.getYtVideoIdFromUrl(miniPlayerVideoUrl);
	}

	const videoIDDesktop = Util.getAttrFromSelectors(
		'ytd-watch-flexy',
		'video-id',
	);
	if (videoIDDesktop) {
		return videoIDDesktop;
	}

	// as a fallback on mobile, try to get the video ID from the URL
	const videoIDMobile = new URLSearchParams(window.location.search).get('v');
	return videoIDMobile;
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
				'warn',
			);
			categoryCache.set(videoId, categoryUnknown);
		});

	return null;
}

async function fetchCategoryName(videoId: string) {
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

	if (await Util.getOption('YouTube', 'scrobbleMusicRecognisedOnly')) {
		scrobbleMusicRecognisedOnly = true;
		Util.debugLog('Only scrobbling when recognised by YouTube Music');
	}

	if (await Util.getOption('YouTube', 'enableGetTrackInfoFromYtMusic')) {
		getTrackInfoFromYtMusicEnabled = true;
		Util.debugLog('Get track info from YouTube Music enabled');
	}
}

function getVideoDescription() {
	return Util.getTextFromSelectors(videoDescriptionSelector)?.trim() ?? null;
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

function getTrackInfoFromYoutubeMusic():
	| ArtistTrackInfo
	| Record<string, never>
	| undefined {
	// if neither getTrackInfoFromYtMusicEnabled nor scrobbleMusicRecognisedOnly
	// are enabled, there is no need to run this getter
	if (!getTrackInfoFromYtMusicEnabled && !scrobbleMusicRecognisedOnly) {
		return {};
	}

	const videoId = getVideoId();

	if (!getTrackInfoFromYoutubeMusicCache[videoId ?? '']) {
		getTrackInfoFromYoutubeMusicCache[videoId ?? ''] = {
			videoId: null,
			done: false,
			currentTrackInfo: {},
		};
	} else {
		if (!getTrackInfoFromYtMusicEnabled) {
			// this means that only scrobbleMusicRecognisedOnly is enabled,
			// therefore only the cache is used and we return {} for the
			// actual getter
			return {};
		}

		if (getTrackInfoFromYoutubeMusicCache[videoId ?? ''].done) {
			// already ran!
			return getTrackInfoFromYoutubeMusicCache[videoId ?? '']
				.currentTrackInfo;
		}
		// still running, lets be patient
		return {};
	}

	const body = JSON.stringify({
		context: {
			client: {
				// parameters are needed, you get a 400 if you omit these
				// specific values are just what I got when doing a request
				// using firefox
				clientName: 'WEB_REMIX',
				clientVersion: '1.20221212.01.00',
			},
		},
		captionParams: {},
		videoId,
	});

	fetch('https://music.youtube.com/youtubei/v1/player', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body,
	})
		.then((response) => response.json())
		.then((videoInfo) => {
			// TODO: type videoInfo
			getTrackInfoFromYoutubeMusicCache[videoId ?? ''] = {
				done: true,
				// eslint-disable-next-line
				recognisedByYtMusic:
					// eslint-disable-next-line
					videoInfo.videoDetails?.musicVideoType?.startsWith(
						'MUSIC_VIDEO_',
					) || false,
			};

			// if videoDetails is not MUSIC_VIDEO_TYPE_OMV, it seems like it's
			// not something youtube music actually knows, so it usually gives
			// wrong results, so we only return if it is that musicVideoType
			if (
				// eslint-disable-next-line
				videoInfo.videoDetails?.musicVideoType ===
				'MUSIC_VIDEO_TYPE_OMV'
			) {
				getTrackInfoFromYoutubeMusicCache[
					videoId ?? ''
				].currentTrackInfo = {
					// eslint-disable-next-line
					artist: videoInfo.videoDetails.author,
					// eslint-disable-next-line
					track: videoInfo.videoDetails.title,
				};
			}
		})
		.catch((err) => {
			Util.debugLog(
				`Failed to fetch youtube music data for ${videoId}: ${err}`,
				'warn',
			);
			getTrackInfoFromYoutubeMusicCache[videoId ?? ''] = {
				done: true,
				recognisedByYtMusic: false,
			};
		});
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

function getTrackInfoFromTitle(): ArtistTrackInfo {
	let { artist, track } = Util.processYtVideoTitle(
		Util.getTextFromSelectors(videoTitleSelector),
	);
	if (!artist) {
		artist = Util.getTextFromSelectors(channelNameSelector);
	}

	return { artist, track };
}

function removeLtrRtlChars(text: string) {
	return MetadataFilter.filterWithFilterRules(text, [
		{ source: /\u200e/g, target: '' },
		{ source: /\u200f/g, target: '' },
	]);
}

function removeNumericPrefix(text: string) {
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
	const videoElement = document.querySelector(
		videoSelector,
	) as HTMLVideoElement;
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
