import type { ArtistTrackInfo, State } from '@/core/types';
import { ytMusicApiRequest, keyFn, YtApiResult } from './api/ytmusic-api';
import { Category, ytWatchRequest } from './api/yt-watch';

export {};

/**
 * Quick links to debug and test the connector:
 *
 * https://www.youtube.com/watch?v=WA3hL4hDx9c - auto-generated music video
 * The connector should get info via `getTopicArtistTrackFromDescription` function
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

/**
 * Array of categories allowed to be scrobbled.
 */
const allowedCategories: string[] = [];

/**
 * "VideoId=Category" cache.
 */
const ytWatchCache = new Util.MapCache(ytWatchRequest, {
	cb: Connector.onStateChanged,
});

/**
 * "VideoId+Title+Channel=TrackInfo+Category+onYtMusic" cache.
 */
const ytMusicApiCache = new Util.MapCache(ytMusicApiRequest, {
	cb: Connector.onStateChanged,
	keyFn,
});

// convenience method to fetch current id, title, channel
// and deal with possible network errors
function getYtMusicApiCache(): Partial<YtApiResult> | null | undefined {
	const videoId = getVideoId();
	const title = Util.getTextFromSelectors(videoTitleSelector);
	const channel = Util.getTextFromSelectors(channelNameSelector);
	if (!videoId || !title || !channel) {
		return null;
	}
	try {
		return ytMusicApiCache.get({ videoId, title, channel });
	} catch (e) {
		Util.debugLog(`YtMusicApi failed: ${e}`, 'error');

		// return dummy response on error
		return {};
	}
}

/**
 * Wether we should only scrobble music recognised by the YouTube Music API
 */
let scrobbleYTMusicAPIRecognisedOnly = false;

/**
 * Wether the YouTube Music API track info getter is enabled
 */
let getTrackInfoFromYTMusicAPIEnabled = false;

const topicDescriptionCache = new Util.LastCache(
	Util.parseYtTopicVideoDescription,
);

/**
 * different methods of getting information for the currently playing track.
 * once one of them has filled in all required fields (artist, track) the value is used.
 * the return values have different meanings:
 * - @type {State}     fill in fields that are not set yet
 * - @type {null}      method not applicable, skip to the next one.
 * - @type {undefined} method is still waiting on return value. don't test the other methods, just return nothing.
 */
const trackInfoGetters: (() => State | null | undefined)[] = [
	getTrackInfoFromChapters,
	getTrackInfoFromYtMusicApi,
	getTopicArtistTrackFromDescription,
	getTrackInfoFromTitle,
];

export const trackInfoFields = [
	'artist',
	'artists',
	'track',
	'trackArt',
	'album',
	'isPodcast',
] as const;

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

Connector.getChannelId = () => {
	const channelAnchors = Util.queryElements<HTMLAnchorElement>([
		'#upload-info .ytd-channel-name a.yt-simple-endpoint',
		'a.slim-owner-icon-and-title',
	]);
	if (!channelAnchors) {
		return null;
	}
	return new URL(channelAnchors[0]!.href).pathname.slice(1);
};
Connector.channelLabelSelector = [
	'#primary #title+#top-row ytd-channel-name .yt-formatted-string',
	'.slim-owner-icon-and-title .yt-core-attributed-string',
];

Connector.getTrackInfo = () => {
	const trackInfo: State = {};

	for (const getter of trackInfoGetters) {
		const currentTrackInfo = getter();

		if (typeof currentTrackInfo === 'undefined') {
			// wait for getTrackInfoFromYoutubeMusic to finish
			return null;
		}

		Util.fillEmptyFields(trackInfo, currentTrackInfo, trackInfoFields);

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
	const videoElement =
		document.querySelector<HTMLVideoElement>('.html5-main-video');
	return Boolean(videoElement && !videoElement.paused);
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

	if (scrobbleYTMusicAPIRecognisedOnly) {
		const res = getYtMusicApiCache();
		if (typeof res === 'undefined') {
			return 'IsLoading';
		}
		if (res && !res.recognisedByYtMusic) {
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

	// Chapters from the description have an "engagement panel" (sidebar),
	// separate from "auto-chapters" which also have a one, but it's different.
	// Some Music Videos also get text "In this video" inserted where the chapter
	// would be, which this also catches because that only gets inserted when
	// there are no description chapters.
	if (
		!document.querySelector(
			'[target-id="engagement-panel-macro-markers-description-chapters"]',
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
	if (getTrackInfoFromYTMusicAPIEnabled || scrobbleYTMusicAPIRecognisedOnly) {
		const res = getYtMusicApiCache();

		if (res !== null) {
			if (!res || res.category) {
				return res?.category;
			}
			// if ytMusicApi did not get a category
			// e.g. because they changed the API format
			// fall back to fetching from /watch html
		} else {
			// if res == null, then either video id, title, or channel failed to be found
			// fall back to fetching from /watch html
		}
	}

	const videoId = getVideoId();

	if (!videoId) {
		return null;
	}

	return ytWatchCache.get(videoId)?.category;
}

/**
 * Asynchronously read connector options.
 */
async function readConnectorOptions() {
	if (await Util.getOption('YouTube', 'scrobbleMusicOnly')) {
		allowedCategories.push(Category.Music);
	}
	if (await Util.getOption('YouTube', 'scrobbleEntertainmentOnly')) {
		allowedCategories.push(Category.Entertainment);
	}
	Util.debugLog(`Allowed categories: ${allowedCategories.join(', ')}`);

	if (await Util.getOption('YouTube', 'scrobbleMusicRecognisedOnly')) {
		scrobbleYTMusicAPIRecognisedOnly = true;
		Util.debugLog(
			'Only scrobbling when recognised by the YouTube Music API',
		);
	}

	if (await Util.getOption('YouTube', 'enableGetTrackInfoFromYtMusic')) {
		getTrackInfoFromYTMusicAPIEnabled = true;
		Util.debugLog('Get track info from the YouTube Music API enabled');
	}
}

function getVideoDescription() {
	return Util.getTextFromSelectors(videoDescriptionSelector)?.trim() ?? null;
}

function getTopicArtistTrackFromDescription() {
	return topicDescriptionCache.get(getVideoDescription());
}

function getTrackInfoFromYtMusicApi() {
	const res = getYtMusicApiCache();
	if (!res) {
		return res;
	}
	return res.currentTrackInfo;
}

function getTrackInfoFromChapters(): ArtistTrackInfo | null {
	// Short circuit if chapters not available - necessary to avoid misscrobbling with SponsorBlock.
	if (!areChaptersAvailable()) {
		return null;
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
		const channelName = Util.getTextFromSelectors(channelNameSelector);
		const re =
			// eslint-disable-next-line no-irregular-whitespace
			/^(?:Mavzu|Тема|الموضوع|ਵਿਸ਼ਾ)\s[–-]\s|(?:(?:\s[-—–]|[:՝])\s(?:Onderwerp|Mövzu|Topik|tema|Tema|téma|Emne|Thema|teema|Topic|gaia|Paksa|Sujet|Isihloko|Efni|Mada|tēma|téma|emne|temat|Tópico|Subiect|aihekanava|Ämne|Chủ đề|Konu|тэма|Тема|Тақырып|Сэдэв|тема|Θέμα|թեմա|נושא|موضوع|عنوان|विषय|বিষয়বস্তু|বিষয়|મુદ્દો|ବିଷୟ|தலைப்பு|అంశం|ವಿಷಯ|വിഷയം|මාතෘකාව|หัวข้อ|ຫົວ​ຂໍ້|ခေါင်းစဉ်|თემა|ርዕስ|ប្រធាន​បទ|主题|主題|トピック|주제)|\s\(tema\))$/;
		artist = channelName?.replace(re, '') ?? null;
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
		videoCategory === Category.Unknown
	);
}
