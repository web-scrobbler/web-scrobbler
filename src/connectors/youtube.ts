import type { ArtistTrackInfo, TrackInfoWithAlbum } from '@/core/types';
import {
	extractElementTextWithNewlines,
	extractVideoIdFromLocation,
	fetchMobileNextData,
	fetchWatchVideoMetadata,
	fetchYouTubeMusicInfo,
	getActiveChapterTitle,
	isMobileYouTubePage,
	isValidYouTubeVideoId,
	normalizeChannelId,
	readMobileClientVersion,
	setBoundedCache,
	type MobileNextVideoData,
	type WatchVideoMetadata,
	type YouTubeMusicCacheEntry,
} from './helpers/youtube';

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
const mainVideoSelectors = [
	'#movie_player video.html5-main-video',
	'#player video.html5-main-video',
	videoSelector,
];
const playerContainerSelector = ['#movie_player', '.html5-video-player'];
const adPlayingSelector =
	'#movie_player.ad-showing, #movie_player.ad-interrupting, .ad-showing, .ad-interrupting';

const chapterNameSelector = '.html5-video-player .ytp-chapter-title-content';
const videoTitleSelector = [
	'.html5-video-player .ytp-title-link',
	'.slim-video-information-title .yt-core-attributed-string',
	'.slim-video-information-title',
	'yt-video-metadata-view-model .ytVideoMetadataViewModelTitle',
];
const channelNameSelector = [
	'#top-row .ytd-channel-name a',
	'.slim-owner-channel-name .yt-core-attributed-string',
	'.slim-owner-channel-name',
	'yt-channel-bar-header-view-model .ytChannelBarHeaderViewModelTitle',
];
const channelAnchorSelector = [
	'#upload-info .ytd-channel-name .yt-simple-endpoint',
	'.slim-owner-icon-and-title',
];
const videoDescriptionSelector = [
	'#description.ytd-expandable-video-description-body-renderer',
	'#meta-contents #description',
	'.crawler-full-description',
];

const videoPlaybackEvents = [
	'timeupdate',
	'play',
	'pause',
	'playing',
	'ended',
	'seeking',
	'seeked',
	'durationchange',
];

const spaNavigationEvents = [
	'yt-navigate-finish',
	'yt-page-data-updated',
	'state-navigateend',
	'popstate',
];

// Dummy category indicates an actual category is being fetched
const categoryPending = 'YT_DUMMY_CATEGORY_PENDING';
// Fallback value in case when we cannot fetch a category.
const categoryUnknown = 'YT_DUMMY_CATEGORY_UNKNOWN';

const categoryMusic = 'Music';
const categoryEntertainment = 'Entertainment';

type MobileVideoCacheEntry =
	| { status: 'pending'; signal: AbortSignal }
	| { status: 'ready'; data: MobileNextVideoData }
	| { status: 'error' };

type WatchMetadataCacheEntry =
	| { status: 'pending'; signal: AbortSignal }
	| { status: 'ready'; data: WatchVideoMetadata }
	| { status: 'error' };

type YouTubeMusicCacheRecord =
	| { status: 'pending'; signal: AbortSignal }
	| { status: 'ready'; data: YouTubeMusicCacheEntry };

/**
 * Array of categories allowed to be scrobbled.
 */
const allowedCategories: string[] = [];

/**
 * Watch metadata ("Video Id -> category / shortDescription") bounded cache.
 */
const watchMetadataCache = new Map<string, WatchMetadataCacheEntry>();

/**
 * Mobile InnerTube `/next` metadata bounded cache.
 */
const mobileVideoCache = new Map<string, MobileVideoCacheEntry>();

/**
 * YouTube Music track recognition/metadata bounded cache.
 */
const ytMusicCache = new Map<string, YouTubeMusicCacheRecord>();

/**
 * Observed `<video>` elements to prevent duplicate listener registration across SPA mutations.
 */
const observedVideoElements = new WeakSet<HTMLVideoElement>();

/**
 * Whether connector options have been read from browser storage.
 */
let connectorOptionsLoaded = false;

/**
 * Whether we should only scrobble music recognised by YouTube Music.
 */
let scrobbleMusicRecognisedOnly = false;

/**
 * Whether the YouTube Music track info getter is enabled.
 */
let getTrackInfoFromYtMusicEnabled = false;

let currentVideoDescription: string | null = null;
let artistTrackFromDescription: TrackInfoWithAlbum | null = null;

let activeVideoId: string | null = null;
let navigationAbortController = new AbortController();

let playerObserver: MutationObserver | null = null;
let observedPlayerNode: Element | null = null;
let bootstrapObserver: MutationObserver | null = null;

const mobileClientVersion = readMobileClientVersion(
	typeof document !== 'undefined' ? document : null,
);

const trackInfoGetters: (() =>
	| ArtistTrackInfo
	| null
	| undefined
	| Record<string, never>
	| TrackInfoWithAlbum)[] = [
	getTrackInfoFromChapters,
	getTrackInfoFromYoutubeMusic,
	getTopicArtistTrackFromDescription,
	getTrackInfoFromTitle,
];

void readConnectorOptions();
setupEventListener();

Connector.playerSelector = ['#content', '#app'];

Connector.scrobbleInfoLocationSelector =
	'#primary #title.ytd-watch-metadata, ytm-slim-video-metadata-section-renderer';
Connector.scrobbleInfoStyle = {
	...Connector.scrobbleInfoStyle,
	fontSize: '1.17em',
	fontWeight: '700',
};

Connector.loveButtonSelector = [
	'ytd-watch-metadata like-button-view-model button[aria-pressed="false"]',
	'ytm-slim-video-metadata-section-renderer like-button-view-model button[aria-pressed="false"]',
];

Connector.unloveButtonSelector = [
	'ytd-watch-metadata like-button-view-model button[aria-pressed="true"]',
	'ytm-slim-video-metadata-section-renderer like-button-view-model button[aria-pressed="true"]',
];

Connector.getChannelId = () => {
	const videoId = getVideoId();

	if (isMobileMode() && videoId) {
		const mobileEntry = ensureMobileVideoMetadata(videoId);
		if (mobileEntry.status === 'pending') {
			return '';
		}
		if (mobileEntry.status === 'ready' && mobileEntry.data.channelId) {
			return mobileEntry.data.channelId;
		}
	}

	const channelAnchor = Util.queryElements<HTMLAnchorElement>(
		channelAnchorSelector,
	)?.[0];
	return normalizeChannelId(channelAnchor?.href) ?? '';
};

Connector.channelLabelSelector = [
	'#primary #title+#top-row ytd-channel-name .yt-formatted-string',
	'.slim-owner-icon-and-title .yt-core-attributed-string',
	'.slim-owner-channel-name',
	'yt-channel-bar-header-view-model .ytChannelBarHeaderViewModelTitle',
];

Connector.getChannelLabel = () => getChannelNameText();

Connector.getTrackInfo = () => {
	const videoId = getVideoId();
	const trackInfo: TrackInfoWithAlbum = {};

	if (isMobileMode() && videoId) {
		const mobileEntry = ensureMobileVideoMetadata(videoId);
		if (mobileEntry.status === 'pending') {
			return trackInfo;
		}
	}

	if (getTrackInfoFromYtMusicEnabled && videoId) {
		const ytMusicEntry = ensureYouTubeMusicInfo(videoId);
		if (!ytMusicEntry || ytMusicEntry.status === 'pending') {
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
	const videoElement = getMainVideoElement();
	if (videoElement && !areChaptersAvailable()) {
		const { currentTime, duration, playbackRate } = videoElement;
		if (Number.isFinite(playbackRate) && playbackRate > 0) {
			return {
				currentTime: currentTime / playbackRate,
				duration: duration / playbackRate,
			};
		}
		return { currentTime, duration };
	}

	return null;
};

Connector.isPlaying = () => {
	return Util.hasElementClass(playerContainerSelector, 'playing-mode');
};

Connector.getOriginUrl = () => {
	const videoId = getVideoId();
	if (!videoId) {
		return document.location.href;
	}

	return `https://youtu.be/${videoId}`;
};

Connector.getUniqueID = () => {
	if (areChaptersAvailable()) {
		return null;
	}

	return getVideoId();
};

Connector.scrobblingDisallowedReason = () => {
	if (document.querySelector(adPlayingSelector)) {
		return 'IsAd';
	}

	// Workaround to prevent scrobbling the video opened in a background tab.
	if (!isVideoStartedPlaying()) {
		return 'Other';
	}

	if (!connectorOptionsLoaded) {
		return 'IsLoading';
	}

	const videoId = getVideoId();
	const isMobilePending =
		isMobileMode() &&
		videoId !== null &&
		ensureMobileVideoMetadata(videoId).status === 'pending';

	let ytMusicPending = false;
	let ytMusicRecognised = true;
	if (scrobbleMusicRecognisedOnly) {
		if (!videoId) {
			return 'Other';
		}
		const ytMusicEntry = ensureYouTubeMusicInfo(videoId);
		if (!ytMusicEntry || ytMusicEntry.status === 'pending') {
			ytMusicPending = true;
		} else if (!ytMusicEntry.data.recognisedByYtMusic) {
			ytMusicRecognised = false;
		}
	}

	let categoryPendingLoad = false;
	if (allowedCategories.length > 0 && videoId) {
		categoryPendingLoad = getVideoCategory() === categoryPending;
	}

	if (isMobilePending || ytMusicPending || categoryPendingLoad) {
		return 'IsLoading';
	}

	if (scrobbleMusicRecognisedOnly && !ytMusicRecognised) {
		return 'NotOnYouTubeMusic';
	}

	return isVideoCategoryAllowed() ? null : 'ForbiddenYouTubeCategory';
};

Connector.applyFilter(
	MetadataFilter.createYouTubeFilter().append({
		artist: [removeLtrRtlChars, removeNumericPrefix],
		track: [removeLtrRtlChars, removeNumericPrefix],
	}),
);

function isMobileMode(): boolean {
	return isMobileYouTubePage(window.location.hostname);
}

function getMainVideoElement(): HTMLVideoElement | null {
	for (const selector of mainVideoSelectors) {
		const element = document.querySelector<HTMLVideoElement>(selector);
		if (element) {
			return element;
		}
	}
	return null;
}

function attachVideoListeners(): void {
	const videos = document.querySelectorAll<HTMLVideoElement>(
		mainVideoSelectors.join(', '),
	);
	for (const videoEl of videos) {
		if (observedVideoElements.has(videoEl)) {
			continue;
		}
		observedVideoElements.add(videoEl);
		for (const eventName of videoPlaybackEvents) {
			videoEl.addEventListener(eventName, Connector.onStateChanged);
		}
	}
}

function syncPlayerObserver(): void {
	attachVideoListeners();

	if (typeof MutationObserver === 'undefined') {
		return;
	}

	const playerEl =
		document.querySelector('#movie_player') ??
		document.querySelector('#player');

	if (playerEl) {
		if (bootstrapObserver) {
			bootstrapObserver.disconnect();
			bootstrapObserver = null;
		}
		if (playerEl !== observedPlayerNode) {
			playerObserver?.disconnect();
			observedPlayerNode = playerEl;
			playerObserver = new MutationObserver(() => {
				syncPlayerObserver();
				Connector.onStateChanged();
			});
			playerObserver.observe(playerEl, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['class', 'hidden'],
			});
		}
		return;
	}

	if (!bootstrapObserver) {
		const rootTarget = document.body ?? document.documentElement;
		if (!rootTarget) {
			return;
		}
		bootstrapObserver = new MutationObserver(() => {
			if (
				document.querySelector('#movie_player') ??
				document.querySelector('#player')
			) {
				syncPlayerObserver();
				Connector.onStateChanged();
			}
		});
		bootstrapObserver.observe(rootTarget, {
			childList: true,
			subtree: true,
		});
	}
}

function handleNavigationEvent(): void {
	getVideoId();
	syncPlayerObserver();
	Connector.onStateChanged();
}

function setupEventListener(): void {
	getVideoId();
	syncPlayerObserver();

	for (const eventName of spaNavigationEvents) {
		window.addEventListener(eventName, handleNavigationEvent);
	}
}

function getReadyMobileMetadata(
	videoId: string | null,
): MobileNextVideoData | null {
	if (!videoId) {
		return null;
	}
	const entry = mobileVideoCache.get(videoId);
	return entry?.status === 'ready' ? entry.data : null;
}

function isMobileMetadataPending(videoId: string | null): boolean {
	if (!videoId) {
		return false;
	}
	const entry = mobileVideoCache.get(videoId);
	return entry?.status === 'pending' && !entry.signal.aborted;
}

function ensureMobileVideoMetadata(videoId: string): MobileVideoCacheEntry {
	const existing = mobileVideoCache.get(videoId);
	if (
		existing &&
		(existing.status !== 'pending' || !existing.signal.aborted)
	) {
		return existing;
	}

	const { signal } = navigationAbortController;
	const pending: MobileVideoCacheEntry = { status: 'pending', signal };
	setBoundedCache(mobileVideoCache, videoId, pending);

	const { origin } = window.location;

	void fetchMobileNextData(origin, videoId, mobileClientVersion, signal).then(
		(result) => {
			if (mobileVideoCache.get(videoId) !== pending) {
				return;
			}

			if (result.status === 'aborted') {
				mobileVideoCache.delete(videoId);
				return;
			}

			if (result.status === 'ok') {
				setBoundedCache(mobileVideoCache, videoId, {
					status: 'ready',
					data: result.data,
				});
				Util.debugLog(`Fetched mobile metadata for ${videoId}`);
				if (result.data.description === null) {
					ensureWatchMetadata(videoId);
				}
			} else {
				setBoundedCache(mobileVideoCache, videoId, { status: 'error' });
				Util.debugLog(
					`Failed to fetch mobile metadata for ${videoId}: ${result.reason ?? 'unknown'}`,
					'warn',
				);
			}

			if (getVideoId() === videoId) {
				Connector.onStateChanged();
			}
		},
	);

	return pending;
}

function ensureWatchMetadata(videoId: string): WatchMetadataCacheEntry {
	const existing = watchMetadataCache.get(videoId);
	if (
		existing &&
		(existing.status !== 'pending' || !existing.signal.aborted)
	) {
		return existing;
	}

	const { signal } = navigationAbortController;
	const pending: WatchMetadataCacheEntry = { status: 'pending', signal };
	setBoundedCache(watchMetadataCache, videoId, pending);

	const { origin } = window.location;

	void fetchWatchVideoMetadata(origin, videoId, signal).then((result) => {
		if (watchMetadataCache.get(videoId) !== pending) {
			return;
		}

		if (result.status === 'aborted') {
			watchMetadataCache.delete(videoId);
			return;
		}

		if (result.status === 'ok') {
			setBoundedCache(watchMetadataCache, videoId, {
				status: 'ready',
				data: result.data,
			});
			Util.debugLog(
				`Fetched category for ${videoId}: ${result.data.category ?? categoryUnknown}`,
			);
		} else {
			setBoundedCache(watchMetadataCache, videoId, { status: 'error' });
			Util.debugLog(
				`Failed to fetch category for ${videoId}: ${result.reason ?? 'unknown'}`,
				'warn',
			);
		}

		if (getVideoId() === videoId) {
			Connector.onStateChanged();
		}
	});

	return pending;
}

function ensureYouTubeMusicInfo(
	videoId: string,
): YouTubeMusicCacheRecord | null {
	if (!isValidYouTubeVideoId(videoId)) {
		return null;
	}

	const existing = ytMusicCache.get(videoId);
	if (
		existing &&
		(existing.status !== 'pending' || !existing.signal.aborted)
	) {
		return existing;
	}

	const { signal } = navigationAbortController;
	const pending: YouTubeMusicCacheRecord = { status: 'pending', signal };
	setBoundedCache(ytMusicCache, videoId, pending);

	void fetchYouTubeMusicInfo(videoId, signal).then((result) => {
		if (ytMusicCache.get(videoId) !== pending) {
			return;
		}

		if (result.status === 'aborted') {
			ytMusicCache.delete(videoId);
			return;
		}

		if (result.status === 'ok') {
			setBoundedCache(ytMusicCache, videoId, {
				status: 'ready',
				data: result.data,
			});
		} else {
			Util.debugLog(
				`Failed to fetch youtube music data for ${videoId}: ${result.reason ?? 'unknown'}`,
				'warn',
			);
			setBoundedCache(ytMusicCache, videoId, {
				status: 'ready',
				data: {
					done: true,
					recognisedByYtMusic: false,
				},
			});
		}

		if (getVideoId() === videoId) {
			Connector.onStateChanged();
		}
	});

	return pending;
}

function areChaptersAvailable(): string | false | null {
	// SponsorBlock extension hijacks chapter element. Ignore it.
	if (
		document.querySelector(
			'.ytp-chapter-title-content.sponsorBlock-segment-title',
		)
	) {
		return false;
	}

	if (isMobileMode()) {
		const videoId = getVideoId();
		if (isMobileMetadataPending(videoId)) {
			return false;
		}
		const mobileData = getReadyMobileMetadata(videoId);
		if (mobileData) {
			if (mobileData.chapters.length === 0) {
				return false;
			}
			const currentTime = getMainVideoElement()?.currentTime ?? 0;
			return getActiveChapterTitle(mobileData.chapters, currentTime);
		}
	}

	const text = Util.getTextFromSelectors(chapterNameSelector);

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

function resolveCurrentVideoId(): string | null {
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
		const miniPlayerVideoId = Util.getYtVideoIdFromUrl(miniPlayerVideoUrl);
		if (isValidYouTubeVideoId(miniPlayerVideoId)) {
			return miniPlayerVideoId;
		}
	}

	const videoIDDesktop = Util.getAttrFromSelectors(
		'ytd-watch-flexy',
		'video-id',
	);
	if (isValidYouTubeVideoId(videoIDDesktop)) {
		return videoIDDesktop;
	}

	// Fallback on mobile and /live/<id> URLs from the current location.
	return extractVideoIdFromLocation(window.location);
}

function getVideoId(): string | null {
	const videoId = resolveCurrentVideoId();
	if (videoId !== activeVideoId) {
		navigationAbortController.abort();
		navigationAbortController = new AbortController();
		activeVideoId = videoId;
		currentVideoDescription = null;
		artistTrackFromDescription = null;
	}
	return videoId;
}

function getVideoCategory(): string | null {
	const videoId = getVideoId();
	if (!videoId) {
		return null;
	}

	const watchEntry = ensureWatchMetadata(videoId);
	if (watchEntry.status === 'pending') {
		return categoryPending;
	}
	if (watchEntry.status === 'error') {
		return categoryUnknown;
	}
	return watchEntry.data.category ?? categoryUnknown;
}

/**
 * Asynchronously read connector options.
 */
async function readConnectorOptions(): Promise<void> {
	try {
		const [
			scrobbleMusicOnly,
			scrobbleEntertainmentOnly,
			scrobbleMusicRecognisedOnlyOption,
			enableGetTrackInfoFromYtMusicOption,
		] = await Promise.all([
			Util.getOption('YouTube', 'scrobbleMusicOnly'),
			Util.getOption('YouTube', 'scrobbleEntertainmentOnly'),
			Util.getOption('YouTube', 'scrobbleMusicRecognisedOnly'),
			Util.getOption('YouTube', 'enableGetTrackInfoFromYtMusic'),
		]);

		if (scrobbleMusicOnly && !allowedCategories.includes(categoryMusic)) {
			allowedCategories.push(categoryMusic);
		}
		if (
			scrobbleEntertainmentOnly &&
			!allowedCategories.includes(categoryEntertainment)
		) {
			allowedCategories.push(categoryEntertainment);
		}
		Util.debugLog(`Allowed categories: ${allowedCategories.join(', ')}`);

		if (scrobbleMusicRecognisedOnlyOption) {
			scrobbleMusicRecognisedOnly = true;
			Util.debugLog('Only scrobbling when recognised by YouTube Music');
		}

		if (enableGetTrackInfoFromYtMusicOption) {
			getTrackInfoFromYtMusicEnabled = true;
			Util.debugLog('Get track info from YouTube Music enabled');
		}
	} finally {
		connectorOptionsLoaded = true;
		Connector.onStateChanged();
	}
}

function getVideoTitleText(): string | null {
	if (isMobileMode()) {
		const videoId = getVideoId();
		if (isMobileMetadataPending(videoId)) {
			return null;
		}
		const mobileData = getReadyMobileMetadata(videoId);
		if (mobileData?.title) {
			return mobileData.title;
		}
	}

	return Util.getTextFromSelectors(videoTitleSelector)?.trim() ?? null;
}

function getChannelNameText(): string | null {
	if (isMobileMode()) {
		const videoId = getVideoId();
		if (isMobileMetadataPending(videoId)) {
			return null;
		}
		const mobileData = getReadyMobileMetadata(videoId);
		if (mobileData?.channelName) {
			return mobileData.channelName;
		}
	}

	return Util.getTextFromSelectors(channelNameSelector)?.trim() ?? null;
}

function getVideoDescription(): string | null {
	if (isMobileMode()) {
		const videoId = getVideoId();
		if (!videoId || isMobileMetadataPending(videoId)) {
			return null;
		}

		const mobileData = getReadyMobileMetadata(videoId);
		if (mobileData?.description) {
			return mobileData.description;
		}

		const watchEntry = watchMetadataCache.get(videoId);
		if (
			watchEntry?.status === 'ready' &&
			watchEntry.data.shortDescription
		) {
			return watchEntry.data.shortDescription;
		}

		const domDesc =
			Util.getTextFromSelectors(videoDescriptionSelector)?.trim() ?? null;
		if (domDesc) {
			return domDesc;
		}

		return extractElementTextWithNewlines(
			document.querySelector('ytm-crawler-description'),
		);
	}

	return Util.getTextFromSelectors(videoDescriptionSelector)?.trim() ?? null;
}

function getTopicArtistTrackFromDescription(): TrackInfoWithAlbum | null {
	const description = getVideoDescription();
	if (currentVideoDescription === description) {
		return artistTrackFromDescription;
	}

	currentVideoDescription = description;
	artistTrackFromDescription = Util.parseYtTopicVideoDescription(description);

	return artistTrackFromDescription;
}

function getTrackInfoFromYoutubeMusic():
	| ArtistTrackInfo
	| Record<string, never> {
	// if neither getTrackInfoFromYtMusicEnabled nor scrobbleMusicRecognisedOnly
	// are enabled, there is no need to run this getter
	if (!getTrackInfoFromYtMusicEnabled && !scrobbleMusicRecognisedOnly) {
		return {};
	}

	const videoId = getVideoId();
	if (!videoId) {
		return {};
	}

	const cacheEntry = ensureYouTubeMusicInfo(videoId);
	if (!getTrackInfoFromYtMusicEnabled) {
		// this means that only scrobbleMusicRecognisedOnly is enabled,
		// therefore only the cache is used and we return {} for the
		// actual getter
		return {};
	}

	if (cacheEntry?.status === 'ready') {
		return cacheEntry.data.currentTrackInfo ?? {};
	}

	return {};
}

function getTrackInfoFromChapters(): ArtistTrackInfo {
	const chapterName = areChaptersAvailable();
	// Short circuit if chapters not available - necessary to avoid misscrobbling with SponsorBlock.
	if (!chapterName) {
		return {
			artist: null,
			track: null,
		};
	}

	const artistTrack = Util.processYtVideoTitle(chapterName);
	if (!artistTrack.track) {
		artistTrack.track = chapterName;
	}
	return artistTrack;
}

function getTrackInfoFromTitle(): ArtistTrackInfo {
	let { artist, track } = Util.processYtVideoTitle(getVideoTitleText());
	if (!artist) {
		const channelName = getChannelNameText();
		const re =
			// eslint-disable-next-line no-irregular-whitespace
			/^(?:Mavzu|Тема|الموضوع|ਵਿਸ਼ਾ)\s[–-]\s|(?:(?:\s[-—–]|[:՝])\s(?:Onderwerp|Mövzu|Topik|tema|Tema|téma|Emne|Thema|teema|Topic|gaia|Paksa|Sujet|Isihloko|Efni|Mada|tēma|téma|emne|temat|Tópico|Subiect|aihekanava|Ämne|Chủ đề|Konu|тэма|Тема|Тақырып|Сэдэв|тема|Θέμα|թեմա|נושא|موضوع|عنوان|विषय|বিষয়বস্তু|বিষয়|મુદ્દો|ବିଷୟ|தலைப்பு|అంశం|ವಿಷಯ|വിഷയം|මාතෘකාව|หัวข้อ|ຫົວ​ຂໍ້|ခေါင်းစဉ်|თემა|ርዕስ|ប្រធាន​បទ|主题|主題|トピック|주제)|\s\(tema\))$/;
		artist = channelName?.replace(re, '') ?? null;
	}

	return { artist, track };
}

function removeLtrRtlChars(text: string): string {
	return MetadataFilter.filterWithFilterRules(text, [
		{ source: /\u200e/g, target: '' },
		{ source: /\u200f/g, target: '' },
	]);
}

function removeNumericPrefix(text: string): string {
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

function isVideoStartedPlaying(): boolean {
	const videoElement = getMainVideoElement();
	return Boolean(videoElement && videoElement.currentTime > 0);
}

function isVideoCategoryAllowed(): boolean {
	if (allowedCategories.length === 0) {
		return true;
	}

	const videoCategory = getVideoCategory();
	if (!videoCategory || videoCategory === categoryPending) {
		return false;
	}

	return (
		allowedCategories.includes(videoCategory) ||
		videoCategory === categoryUnknown
	);
}
