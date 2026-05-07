import { State, ArtistTrackInfo } from '@/core/types';

export {};

class Cache<I> {
	map: {
		[id: string]:
			| undefined
			| { status: 'pending'; promise: Promise<I> }
			| { status: 'error'; error: unknown }
			| { status: 'done'; data: I };
	};
	constructor(public fetcher: (id: string) => Promise<I> | I) {
		this.map = {};
	}

	/**
	 * @param id
	 * @returns undefined on pending
	 * @returns null on error
	 * @returns I when fully resolved
	 */
	get(id: string, cb?: () => void): I | null | undefined {
		const entry = this.map[id];
		switch (entry?.status) {
			case 'error':
				return null;
			case 'pending':
				entry.promise.then(cb);
				return undefined;
			case 'done':
				return entry.data;
		}
		const resp = this.start(id);
		if (resp instanceof Promise) {
			resp.then(cb);
			return undefined;
		} else {
			return resp;
		}
	}

	async getAsync(id: string): Promise<I> {
		const entry = this.map[id];
		switch (entry?.status) {
			case 'error':
				throw entry.error;
			case 'pending':
				return await entry.promise;
			case 'done':
				return entry.data;
		}
		return await this.start(id);
	}

	private start(id: string): Promise<I> | I {
		const fetchResult = this.fetcher(id);

		if (fetchResult instanceof Promise) {
			this.map[id] = { status: 'pending', promise: fetchResult };

			fetchResult
				.then((item) => {
					this.map[id] = { status: 'done', data: item };
				})
				.catch((error) => {
					this.map[id] = { status: 'error', error };
				});

			return fetchResult;
		} else {
			this.map[id] = { status: 'done', data: fetchResult };
			return fetchResult;
		}
	}
}

function findJson(data: string, prefix: string): unknown {
	const start = data.indexOf(prefix) + prefix.length;
	const len = data.slice(start).search(/(?!\\)(\}|\])(?:\s*;)/) + 1;
	return JSON.parse(data.substring(start, start + len));
}

type DeepPartial<T> = T extends object
	? { [P in keyof T]?: DeepPartial<T[P]> }
	: T;

export const ytChannelCache = new Cache(async (channelId: string) => {
	const response = await fetch(
		`https://www.youtube.com/channel/${channelId}`,
	);
	const text = await response.text();
	type Data = {
		metadata?: {
			channelMetadataRenderer?: {
				musicArtistName?: string;
			};
		};
	};
	const data = findJson(text, 'ytInitialData = ') as Data | undefined;
	const musicArtistName =
		data?.metadata?.channelMetadataRenderer?.musicArtistName ?? null;
	return { musicArtistName };
});

export const ytWatchCache = new Cache(async (videoId: string) => {
	const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
	const text = await response.text();
	const playerResponse = findJson(text, 'ytInitialPlayerResponse = ');
	const data = findJson(text, 'ytInitialData = ');

	function get<T = unknown>(
		obj: any | undefined,
		path: string | string[],
	): DeepPartial<T>[] {
		if (!obj) return [];
		let paths: { [_: string]: any } = {};
		for (let p of typeof path === 'string' ? [path] : path) {
			let ps: { [_: string]: any } = { '': obj };
			for (const segm of p.split(/\.|\[\]/)) {
				let new_paths: { [_: string]: any } = {};
				if (segm.length == 0) {
					for (const [path, obj] of Object.entries(ps)) {
						if (!Array.isArray(obj)) continue;
						for (let i = 0; i < obj.length; i++) {
							new_paths[path + '[' + i + ']'] = obj[i];
						}
					}
					p = p.substring(2);
				} else {
					for (const [path, obj] of Object.entries(ps)) {
						if (segm in obj) {
							new_paths[path + '.' + segm] = obj[segm];
						}
					}
				}
				ps = new_paths;
			}
			paths = { ...paths, ...ps };
		}
		return Object.values(paths);
	}

	function simple(
		x: DeepPartial<SimpleText> | null | undefined,
	): string | null {
		return typeof x === 'string' ? x : (x?.simpleText ?? null);
	}
	type SimpleText = string | { simpleText: string };

	const category = get<string>(
		playerResponse,
		'microformat.playerMicroformatRenderer.category',
	).at(0);

	type VideoDetails = {
		videoId: string;
		title: string;
		lengthSeconds: string;
		keywords: string[];
		channelId: string;
		shortDescription: string;
		author: string;
	};
	const videoDetails = get<VideoDetails>(playerResponse, 'videoDetails').at(
		0,
	);
	// const descriptionEngagementPanel = ;
	type VideoAttributeViewModel = {
		image: { sources: { url: string }[] };
		title: string;
		subtitle?: string;
		secondarySubtitle?: { content?: string };
	};
	const attributed = get<VideoAttributeViewModel>(
		get(data, 'engagementPanels[].engagementPanelSectionListRenderer')
			.filter(
				(panel) =>
					(panel as { targetId?: string } | undefined)?.targetId ==
					'engagement-panel-structured-description',
			)
			.at(0),
		'content.structuredDescriptionContentRenderer.items[].horizontalCardListRenderer.cards[].videoAttributeViewModel',
	).map((obj) => {
		const trackArt = get<string>(obj, 'image.sources[].url').at(-1);
		return {
			trackArt,
			track: obj.title,
			artist: obj.subtitle,
			album: obj.secondarySubtitle?.content,
		};
	});

	type MacroMarkersListItemRenderer = {
		timeDescription: SimpleText;
		title: SimpleText;
	};
	const chapters = get<MacroMarkersListItemRenderer>(
		get<{ targetId: string }>(
			data,
			'engagementPanels[].engagementPanelSectionListRenderer',
		).filter(
			(panel) =>
				panel.targetId ===
				'engagement-panel-macro-markers-description-chapters',
		),
		[
			'content.structuredDescriptionContentRenderer.items[].horizontalCardListRenderer.cards[].macroMarkersListItemRenderer',
			'content.macroMarkersListRenderer.contents[].macroMarkersListItemRenderer',
		],
	).map((macroMarkerListItemRenderer) => ({
		title: simple(macroMarkerListItemRenderer.title),
		time: Util.stringToSeconds(
			simple(macroMarkerListItemRenderer.timeDescription),
		),
	}));

	return {
		category,

		title: videoDetails?.title,
		channel: videoDetails?.author,
		channelId: videoDetails?.channelId,

		chapters,
		attributedTrackInfo: attributed.at(0),
	};
});

export const ytMusicCache = new Cache(async (videoId: string) => {
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
	const response = await fetch(
		'https://music.youtube.com/youtubei/v1/player',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body,
		},
	);
	enum MusicVideoType {
		OMV = 'MUSIC_VIDEO_TYPE_OMV',
		ATV = 'MUSIC_VIDEO_TYPE_ATV',
	}
	type VideoInfo = {
		videoDetails: {
			musicVideoType: MusicVideoType | string;
			author: string;
			title: string;
		};
	};
	const videoInfo: DeepPartial<VideoInfo> = await response.json();
	const musicVideoType = videoInfo.videoDetails?.musicVideoType;

	const recognisedByYtMusic =
		musicVideoType?.startsWith('MUSIC_VIDEO_') || false;

	let currentTrackInfo;
	switch (musicVideoType) {
		case MusicVideoType.OMV:
			currentTrackInfo = {
				artist: videoInfo.videoDetails?.author,
				track: videoInfo.videoDetails?.title,
			};
	}
	return { recognisedByYtMusic, currentTrackInfo };
});

function getTimeInfo() {
	let videoElement =
		document.querySelector<HTMLVideoElement>('.html5-main-video');
	if (!videoElement) {
		return null;
	}
	let { currentTime, duration, playbackRate, paused } = videoElement;
	currentTime /= playbackRate;
	duration /= playbackRate;
	const isPlaying = !paused;
	return { currentTime, duration, playbackRate, isPlaying };
}

const ytCache = new Cache(ytFetch);

async function ytFetch(
	videoId: string,
): Promise<(cb?: () => void) => State | null> {
	// const cache_cb = () => ytCache.get(videoId);
	const watchReq = ytWatchCache.getAsync(videoId);
	const musicReq = ytMusicCache.getAsync(videoId);

	const doChannelReq = scrobbleAutogeneratedVideosAlways || lookupChannelId;

	let channelId = Connector.getChannelId?.();
	let channelReq =
		doChannelReq && channelId ? ytChannelCache.getAsync(channelId) : null;

	const watch = await watchReq;

	channelId ??= watch.channelId;

	if (doChannelReq && channelId) {
		channelReq ??= ytChannelCache.getAsync(channelId);
	}

	enum ArtistTrackSource {
		Chapter = 'chapter',
		Attributed = 'attributed',
		YTMusic = 'ytmusic',
		Title = 'title',
		Fallthrough = 'none',
	}

	function ytMusicDisallowedReason(
		artistTrackSource: ArtistTrackSource,
		cb?: () => void,
	): ReturnType<typeof Connector.scrobblingDisallowedReason> {
		if (!scrobbleMusicRecognizedOnly) {
			return;
		}
		if (
			artistTrackSource === ArtistTrackSource.Attributed &&
			scrobbleMusicUnrecognizedAttributed
		) {
			return;
		}
		const music = ytMusicCache.get(videoId, cb);
		if (music === undefined) {
			return 'IsLoading';
		}
		if (music === null) {
			return 'Other';
		}
		if (!music.recognisedByYtMusic) {
			return 'NotOnYouTubeMusic';
		}
	}
	const categoryDisallowedReason = (): ReturnType<
		typeof Connector.scrobblingDisallowedReason
	> => {
		if (allowedCategories.length === 0) {
			return;
		}
		if (!watch.category || !allowedCategories.includes(watch.category)) {
			console.log(
				`[youtube-shared.ts] category ${watch.category} denied`,
			);
			return 'ForbiddenYouTubeCategory';
		}
	};

	const scrobblingDisallowedReason = (
		artistTrackSource: ArtistTrackSource,
		cb?: () => void,
	) => {
		// invoke this early so that ytmusic request is definitely started if needed
		let scrobblingDisallowedReason =
			categoryDisallowedReason() ??
			ytMusicDisallowedReason(artistTrackSource, cb);
		if (scrobbleAutogeneratedVideosAlways && channelId) {
			const realChannelName = ytChannelCache.get(channelId, cb);
			if (realChannelName?.musicArtistName) {
				return;
			}
			if (realChannelName === undefined) {
				scrobblingDisallowedReason ??= 'IsLoading';
			}
		}
		return scrobblingDisallowedReason;
	};

	const trackInfo = {};

	// undefined signifies incomplete value
	// null signifies invalid state
	type Getter = (cb?: () => void) => State | null | undefined;

	// type EnumValues<T> = T[keyof T];
	const getters: Map<ArtistTrackSource, Getter> = new Map();

	// use chapters if available
	if (watch.chapters) {
		const breakpoints = watch.chapters.map((chapter) => chapter.time);
		const artistTrackArray = watch.chapters.map(
			(chapter): ArtistTrackInfo => {
				let artistTrack = Util.processYtVideoTitle(chapter.title);
				artistTrack ??= {
					track: chapter.title,
				};
				return artistTrack;
			},
		);

		getters.set(ArtistTrackSource.Chapter, (cb) => {
			const timeInfo = getTimeInfo();
			if (!timeInfo) {
				return null;
			}
			let { currentTime, duration, playbackRate, isPlaying } = timeInfo;

			let i = 0;
			while (
				breakpoints.at(i + 1) !== undefined &&
				currentTime * playbackRate > breakpoints[i + 1]
			) {
				i++;
			}

			const uniqueID = `${videoId}?t=${breakpoints[i]}`;

			// adjust time to only be the chapter
			const breakpointScaled = breakpoints[i] / playbackRate;
			currentTime = currentTime - breakpointScaled;
			duration =
				(breakpoints.at(i + 1)
					? breakpoints[i + 1] / playbackRate
					: duration) - breakpointScaled;

			return {
				...artistTrackArray[i],
				currentTime,
				duration,
				uniqueID,
			};
		});
	}

	// use attributed track if available and enabled
	if (useAttributedTrackInfo && watch.attributedTrackInfo) {
		let trackInfo;
		if (!watch.attributedTrackInfo.artist) {
			trackInfo =
				Util.processYtVideoTitle(watch.attributedTrackInfo.track) ?? {};
			Util.fillEmptyFields(trackInfo, watch.attributedTrackInfo, [
				'trackArt',
				'track',
				'artist',
				'album',
			]);
		} else {
			trackInfo = watch.attributedTrackInfo;
		}

		getters.set(ArtistTrackSource.Attributed, () => trackInfo);
	}

	// use yt music info if available
	if (enableGetTrackInfoFromYtMusic) {
		const music = await musicReq;
		if (music.currentTrackInfo) {
			const trackInfo = music.currentTrackInfo;
			getters.set(ArtistTrackSource.YTMusic, () => trackInfo);
		}
	}

	// fall back to title+author
	getters.set(ArtistTrackSource.Title, () => {
		let artistTrack: State = Util.processYtVideoTitle(watch.title);

		artistTrack.track ??= watch.title;

		if (!artistTrack.artist) {
			const channelInfo =
				lookupChannelId && channelId
					? ytChannelCache.get(channelId)
					: null;
			if (channelInfo === undefined) {
				artistTrack.scrobblingDisallowedReason = 'IsLoading';
			} else if (channelInfo) {
				artistTrack.artist = channelInfo.musicArtistName;
			}

			artistTrack.artist ??= watch.channel;
		}

		return artistTrack;
	});

	const priority = [
		ArtistTrackSource.Chapter,
		ArtistTrackSource.Attributed,
		ArtistTrackSource.YTMusic,
		ArtistTrackSource.Title,
	];
	return (cb?: () => void) => {
		const state: State = {};
		let source = ArtistTrackSource.Fallthrough;
		for (source of priority) {
			const getter = getters.get(source);
			if (!getter) {
				continue;
			}
			const got = getter(cb);

			Util.fillEmptyFields(state, got, [
				'trackArt', // attributed
				'track', // all
				'artist', // all (hopefully)
				'album', // yt music, attributed
				'currentTime', // chapter
				'duration', // chapter
				'uniqueID', // chapter
				'scrobblingDisallowedReason', // title (channel lookup)
			]);

			if (!Util.isArtistTrackEmpty(state)) {
				break;
			}
		}

		Util.fillEmptyFields(state, getTimeInfo(), [
			'currentTime',
			'duration',
			'isPlaying',
		]);

		Util.fillEmptyFields(
			state,
			{ scrobblingDisallowedReason: scrobblingDisallowedReason(source) },
			['scrobblingDisallowedReason'],
		);

		state.uniqueID ??= videoId;
		state.originUrl = `https://youtu.be/${state.uniqueID}`;

		return state;
	};
}

const enableGetTrackInfoFromYtMusic = true;
const useAttributedTrackInfo = true;
const allowedCategories = ['Music'];
const scrobbleAutogeneratedVideosAlways = true;
const scrobbleMusicRecognizedOnly = true;
const scrobbleMusicUnrecognizedAttributed = true;
const lookupChannelId = true;

/**
 * fucks up your connector probably
 * call this after setting up all your getter functions - they act as callbacks
 */
export function setupConnector() {
	const oldStateFn = Connector.getCurrentState;
	Connector.getCurrentState = () => {
		const videoId = Connector.getUniqueID();
		if (videoId) {
			console.log(`[youtube-shared.ts] ${videoId}`);
			const stateFunction = ytCache.get(
				videoId,
				Connector.onStateChanged,
			);
			if (stateFunction) {
				console.log(`[youtube-shared.ts] yass`);
				const state = stateFunction(Connector.onStateChanged);
				if (!Util.isArtistTrackEmpty(state)) {
					return state!;
				}
				console.log(`[youtube-shared.ts] NOOOOOO`);
			}
		}
		console.log(`[youtube-shared.ts] fallback.....`);
		return oldStateFn();
	};
	console.log('[youtube-shared.ts] done with setup');
}
