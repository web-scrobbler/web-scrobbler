import type {
	ArtistTrackInfo,
	BaseState,
	TrackInfoWithAlbum,
} from '@/core/types';

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
 * Wether we should only scrobble music recognised by the YouTube Music API
 */
let scrobbleYTMusicAPIRecognisedOnly = false;

/**
 * Wether the YouTube Music API track info getter is enabled
 */
let getTrackInfoFromYTMusicAPIEnabled = false;

let currentVideoDescription: string | null = null;
let artistTrackFromDescription: TrackInfoWithAlbum | null = null;

const getTrackInfoFromYoutubeMusicCache: {
	[videoId: string]:
		| undefined
		| {
				done: false;
		  }
		| {
				done: true;
				recognisedByYtMusic: boolean;
				currentTrackInfo?: BaseState & { artists?: string[] | null };
		  };
} = {};

/**
 * different methods of getting information for the currently playing track.
 * once one of them has filled in all required fields (artist, track) the value is used.
 * the return values have different meanings:
 * - @type {BaseState} fill in fields that are not set yet
 * - @type {null}      method not applicable, skip to the next one.
 * - @type {undefined} method is still waiting on return value. don't test the other methods, just return nothing.
 */
const trackInfoGetters: (() => BaseState | null | undefined)[] = [
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
	const trackInfo: BaseState = {};

	for (const getter of trackInfoGetters) {
		const currentTrackInfo = getter();

		if (typeof currentTrackInfo === 'undefined') {
			// wait for getTrackInfoFromYoutubeMusic to finish
			return null;
		}

		trackInfo.artist ??= currentTrackInfo?.artist ?? null;
		trackInfo.artists ??= currentTrackInfo?.artists ?? null;
		trackInfo.track ??= currentTrackInfo?.track ?? null;
		trackInfo.trackArt ??= currentTrackInfo?.trackArt ?? null;
		trackInfo.album ??= currentTrackInfo?.album ?? null;

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
	return !videoElement?.paused;
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
		const videoId = getVideoId() ?? '';
		const ytMusicCache = getTrackInfoFromYoutubeMusicCache[videoId];

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
	} catch {
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

function getTrackInfoFromDescription() {
	const description = getVideoDescription();
	if (currentVideoDescription === description) {
		return artistTrackFromDescription;
	}

	currentVideoDescription = description;
	artistTrackFromDescription = Util.parseYtVideoDescription(description);

	return artistTrackFromDescription;
}

function getTrackInfoFromYoutubeMusic(): BaseState | null | undefined {
	// if neither getTrackInfoFromYtMusicEnabled nor scrobbleMusicRecognisedOnly
	// are enabled, there is no need to run this getter
	if (
		!getTrackInfoFromYTMusicAPIEnabled &&
		!scrobbleYTMusicAPIRecognisedOnly
	) {
		return null;
	}

	const videoId = getVideoId();
	if (!videoId) {
		// no video ID, no info.
		return null;
	}

	if (getTrackInfoFromYoutubeMusicCache[videoId]) {
		// cache hit

		if (!getTrackInfoFromYTMusicAPIEnabled) {
			// this means that only scrobbleMusicRecognisedOnly is enabled,
			// therefore only the cache is used and we return {} for the
			// actual getter
			return {};
		}

		if (getTrackInfoFromYoutubeMusicCache[videoId].done) {
			// already ran!
			return getTrackInfoFromYoutubeMusicCache[videoId].currentTrackInfo;
		}
		// still running, lets be patient
		return undefined;
	}

	// cache not initialized -> start request
	getTrackInfoFromYoutubeMusicCache[videoId] = {
		done: false,
	};

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

	interface VideoInfo {
		videoDetails?: Partial<{
			videoId: string;
			// track or title
			title: string;
			channelId: string;
			// square cover art if ATV, otherwise just thumbnails
			thumbnail: {
				thumbnails?: Partial<{
					url: string;
					width: number;
					height: number;
				}>[];
			};
			lengthSeconds: number;
			// artist(s joined by delimiters), channel or podcast
			author: string;
			musicVideoType?: string;
			// nonexhaustive
			[other: string]: unknown | undefined;
		}>;
		microformat?: {
			microformatDataRenderer?: Partial<{
				// track or title
				title: string;
				// channel or "Episode • <podcast>"
				description: string;
				// for ATV album track: [("<artist>",)+ "<album>", "<track>"] (https://www.youtube.com/watch?v=i1D8WkGuq4g)
				// for ATV single: ["<artist>", "<track>"] (https://www.youtube.com/watch?v=tNT5sYheayM)
				// all artists are in the .videoDetails.author string, in this order.
				tags: string[];
				pageOwnerDetails: {
					// channel (if applicable "<channel> - Topic")
					name: string;
					externalChannelId: string;
					youtubeProfileUrl: string;
				};
				// Music or Entertainment or... others
				category: string;
				// nonexhaustive
				[other: string]: unknown;
			}>;
		};
		// nonexhaustive
		[other: string]: unknown | undefined;
	}

	fetch('https://music.youtube.com/youtubei/v1/player', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body,
	})
		.then((response) => response.json())
		.then((videoInfo: VideoInfo) => {
			const recognisedByYtMusic =
				videoInfo.videoDetails?.musicVideoType?.startsWith(
					'MUSIC_VIDEO_TYPE_',
				) || false;

			let artist = null;
			let artists = null;
			let album = null;
			let track = null;
			let trackArt = null;

			switch (videoInfo.videoDetails?.musicVideoType) {
				/* eslint no-fallthrough: "off" */

				// YouTube Music Library uploads
				// with metadata: "<track>" by "<author>"
				// without metadata: "filename.mp3" by "Music Library Uploads"
				case 'MUSIC_VIDEO_TYPE_PRIVATELY_OWNED_TRACK': // FALLTHROUGH
					// if the author is set as "Music Library Uploads", we ignore it
					// otherwise, accept as valid metadata.
					// it does not appear that this is translated, luckily
					if (
						videoInfo.videoDetails.author ===
						'Music Library Uploads'
					) {
						break;
					}

				//* Autogenerated Topic Video
				// good: "<track>" by "<author>" (https://www.youtube.com/watch?v=wPm68ZJqNy8)
				// uploader is always a " - Topic" channel. the " - Topic" part is never added to the author field
				case 'MUSIC_VIDEO_TYPE_ATV': {
					// always good, created from information supplied to google by record labels
					({ author: artist, title: track } = videoInfo.videoDetails);
					const thumbs = videoInfo.videoDetails.thumbnail?.thumbnails;
					// use thumbnail from here, if available.
					const thumbUrl = thumbs?.[thumbs.length - 1].url;
					// and not default (for PRIVATELY_OWNED_TRACK)
					if (!thumbUrl?.includes('cover_track_default')) {
						trackArt = thumbUrl;
					}
					const tags =
						videoInfo.microformat?.microformatDataRenderer?.tags;
					if (artist && tags) {
						let i = 0;
						let artistPos = 0;
						artists = [];
						while (i < tags.length - 1) {
							const tag = tags[i];
							const tagIndex = artist.indexOf(tag, artistPos);
							if (tagIndex < 0) {
								Util.debugLog(
									`unexpected tag ${tag} of ATV not included in author ${artist}`,
									'warn',
								);
								break;
							}

							artists.push(tag);

							artistPos = tagIndex + tag.length;
							if (artistPos === artist.length) {
								break;
							}
							i++;
						}

						if (++i < tags.length - 2) {
							Util.debugLog(
								`unexpected tag reverse index ${tags.length - i} after author tag matching: ${tags} in ${artist}`,
								'warn',
							);
						}

						if (i === tags.length - 2) {
							album = tags[i++];
						}

						if (i === tags.length - 1 && tags[i] !== track) {
							Util.debugLog(
								`tag matching sanity check failed, track tag ${tags[i]} != ${track}`,
								'warn',
							);
						}
					}

					break;
				}

				// album preview? music video?
				// good: "On a Cherry Blossom Night" by "あいみょん" (http://youtube.com/watch?v=YXe7GQnvzqY)
				// bad: not found yet?
				case 'MUSIC_VIDEO_TYPE_SHOULDER': // FALLTHROUGH
					// treat like OMV for now
					void 0;

				//* Original Music Video
				// good: "<track>" by "<author>" (https://www.youtube.com/watch?v=GsiQM4aYecE)
				// bad: "<title>" by "<channel>" (https://www.youtube.com/watch?v=sIDRbAUjGvA)
				// bug?: "Pinkie" by "Diversity - All Songs" (https://www.youtube.com/watch?v=yu_XJc_5__Q)
				// uploader (probably) has to be an "Official Artist Channel"
				case 'MUSIC_VIDEO_TYPE_OMV': {
					// may need processing if it's exactly "<title>" by "<channel>" -> don't use those
					// if it's not exactly that, then it should be good.
					// EXCEPT NOT: videos that are part of music playlists seem to have a wrong artist set.

					// <channel> or "Episode • <podcast>"
					// but NEVER "<channel> - Topic"
					// let's abuse this to find out if it's a podcast mislabel without having to localize
					const channelOrEpisode =
						videoInfo.microformat?.microformatDataRenderer
							?.description;

					const title = Util.getTextFromSelectors(videoTitleSelector);
					const channel =
						Util.getTextFromSelectors(channelNameSelector);
					if (
						videoInfo.videoDetails.title === title &&
						videoInfo.videoDetails.author === channel
					) {
						// do not use, let title parsing handle it.
					} else if (
						videoInfo.videoDetails.author &&
						videoInfo.videoDetails.author !== channelOrEpisode &&
						channelOrEpisode?.includes(
							videoInfo.videoDetails.author,
						)
					) {
						// don't use it either here, prevent podcast name from being scrobbled as author
					} else {
						({ author: artist, title: track } =
							videoInfo.videoDetails);
					}
					break;
				}

				// ! short and simple: the rest don't reliably provide good information.

				//* User Generated Content
				// album: "<title>" by "<channel>" (https://www.youtube.com/watch?v=RXWIitU8V0A)
				case 'MUSIC_VIDEO_TYPE_UGC':
					// similar to OMV, unclear why something is UGC or OMV.
					// it seems though that UGC does not have the title doctored with.
					// "Official Artist Channel"s can also get a video marked as UGC (https://www.youtube.com/watch?v=cMkJDPvJxdk)
					// ignore, let title parsing handle it
					break;

				// Official video content, but not for a single track
				// uploader (probably) has to be an "Official Artist Channel"
				case 'MUSIC_VIDEO_TYPE_OFFICIAL_SOURCE_MUSIC':
					// we will probably never hit here because chapters will parse?
					// in any case this should not carry any information if it's for multiple videos (mix/album)
					break;

				// podcast episodes.
				case 'MUSIC_VIDEO_TYPE_PODCAST_EPISODE':
					// not music, ignore
					break;

				default:
					if (recognisedByYtMusic) {
						Util.debugLog(
							`YTMusic API: unknown musicVideoType '${videoInfo.videoDetails!.musicVideoType}'. ` +
								'Please tell the web-scrobbler maintainers about it.',
							'warn',
						);
					}
			}

			getTrackInfoFromYoutubeMusicCache[videoId] = {
				done: true,
				recognisedByYtMusic,
				currentTrackInfo: { artist, artists, album, track, trackArt },
			};

			Connector.onStateChanged();
		})
		.catch((err) => {
			Util.debugLog(
				`Failed to fetch youtube music data for ${videoId}: ${err}`,
				'warn',
			);
			getTrackInfoFromYoutubeMusicCache[videoId] = {
				done: true,
				recognisedByYtMusic: false,
			};
		});
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
		videoCategory === categoryUnknown
	);
}
