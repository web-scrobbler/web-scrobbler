import type { ArtistTrackInfo } from '@/core/types';

export const YOUTUBE_MOBILE_HOSTNAME = 'm.youtube.com';
export const DEFAULT_MOBILE_CLIENT_VERSION = '2.20261113.00.00';
export const MAX_CACHE_ENTRIES = 50;
export const FETCH_TIMEOUT_MS = 10_000;

const YOUTUBE_VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_BROWSE_ID_RE = /^UC[A-Za-z0-9_-]{22}$/;
const YOUTUBE_LIVE_PATH_RE = /^\/live\/([A-Za-z0-9_-]{11})(?:\/|$)/;
const MOBILE_CLIENT_VERSION_RE = /^2\.\d{8}\.\d{2}\.\d{2}$/;
const CLIENT_VERSION_EXTRACT_RE =
	/"INNERTUBE_CLIENT_VERSION":"(2\.\d{8}\.\d{2}\.\d{2})"/;

const ALLOWED_YOUTUBE_FETCH_HOSTS = new Set([
	'www.youtube.com',
	'm.youtube.com',
	'youtube.com',
]);

const YOUTUBE_MUSIC_PLAYER_URL = 'https://music.youtube.com/youtubei/v1/player';
const YOUTUBE_MUSIC_CLIENT_NAME = 'WEB_REMIX';
const YOUTUBE_MUSIC_CLIENT_VERSION = '1.20221212.01.00';

const NON_CHANNEL_TOP_SEGMENTS = new Set([
	'watch',
	'live',
	'shorts',
	'results',
	'feed',
	'playlist',
	'gaming',
	'podcasts',
	'premium',
	'account',
	'oops',
]);

const MAX_JSON_STRING_SCAN = 200_000;
const BLOCK_ELEMENT_TAGS = new Set(['DIV', 'P', 'LI', 'BLOCKQUOTE']);
const IGNORED_ELEMENT_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT']);

export interface YouTubeChapter {
	title: string;
	timeRangeStartMillis: number;
}

export interface MobileNextVideoData {
	title: string | null;
	channelName: string | null;
	channelId: string | null;
	description: string | null;
	chapters: YouTubeChapter[];
}

export interface WatchVideoMetadata {
	category: string | null;
	shortDescription: string | null;
}

export interface YouTubeMusicCacheEntry {
	done: boolean;
	recognisedByYtMusic: boolean;
	currentTrackInfo?: ArtistTrackInfo;
}

export type FetchResult<T> =
	| { status: 'ok'; data: T }
	| { status: 'aborted' }
	| { status: 'error'; reason?: string };

/**
 * Type guard verifying a value is a non-null plain record object.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Return trimmed non-empty string if input is a valid string, otherwise null.
 */
function toNonEmptyTrimmedString(value: unknown): string | null {
	if (typeof value !== 'string') {
		return null;
	}
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
}

/**
 * Insert or update an entry in a bounded Map with FIFO/LRU eviction.
 */
export function setBoundedCache<K, V>(
	cache: Map<K, V>,
	key: K,
	value: V,
	maxSize = MAX_CACHE_ENTRIES,
): void {
	if (!Number.isFinite(maxSize) || maxSize <= 0) {
		return;
	}
	if (cache.has(key)) {
		cache.delete(key);
	} else if (cache.size >= maxSize) {
		const oldestKey = cache.keys().next().value;
		if (oldestKey !== undefined) {
			cache.delete(oldestKey);
		}
	}
	cache.set(key, value);
}

/**
 * Validate strict 11-character base64url YouTube video ID.
 */
export function isValidYouTubeVideoId(videoId: unknown): videoId is string {
	return typeof videoId === 'string' && YOUTUBE_VIDEO_ID_RE.test(videoId);
}

/**
 * Parse and validate an HTTPS YouTube origin allowed for API/page fetches.
 */
function parseAllowedYouTubeOrigin(origin: string): string | null {
	try {
		const url = new URL(origin);
		if (
			url.protocol !== 'https:' ||
			url.port !== '' ||
			url.username !== '' ||
			url.password !== '' ||
			url.origin !== origin ||
			!ALLOWED_YOUTUBE_FETCH_HOSTS.has(url.hostname)
		) {
			return null;
		}
		return url.origin;
	} catch {
		return null;
	}
}

/**
 * Validate whether an origin is an HTTPS YouTube host eligible for API fetches.
 */
export function isAllowedYouTubeOrigin(origin: string): boolean {
	return parseAllowedYouTubeOrigin(origin) !== null;
}

/**
 * Determine whether the current hostname is the YouTube mobile site.
 */
export function isMobileYouTubePage(hostname: string): boolean {
	return hostname === YOUTUBE_MOBILE_HOSTNAME;
}

/**
 * Normalize and validate a YouTube channel URL or path to a blocklist channel ID
 * matching desktop connector output (for example `@handle` or `channel/UC...`).
 */
export function normalizeChannelId(
	rawPathOrUrl: string | null | undefined,
): string | null {
	if (typeof rawPathOrUrl !== 'string') {
		return null;
	}

	const trimmed = rawPathOrUrl.trim();
	if (!trimmed) {
		return null;
	}

	// Reject scheme-less protocol-relative strings, path traversal segments, or encoded dots before URL normalization
	if (
		trimmed.startsWith('//') ||
		/(?:^|[\\/])\.\.(?:[\\/]|$)/.test(trimmed) ||
		/%2e/i.test(trimmed)
	) {
		return null;
	}

	let parsed: URL;
	try {
		parsed = new URL(trimmed, 'https://www.youtube.com');
	} catch {
		return null;
	}

	if (
		parsed.protocol !== 'https:' ||
		!ALLOWED_YOUTUBE_FETCH_HOSTS.has(parsed.hostname)
	) {
		return null;
	}

	const normalized = parsed.pathname.slice(1).replace(/\/+$/, '');
	if (!normalized || normalized.includes('..')) {
		return null;
	}

	// eslint-disable-next-line no-control-regex
	if (/[\s?#\u0000-\u001f]/.test(normalized)) {
		return null;
	}

	const topSegment = normalized.split('/')[0]?.toLowerCase() ?? '';
	if (NON_CHANNEL_TOP_SEGMENTS.has(topSegment)) {
		return null;
	}

	if (
		normalized.startsWith('@') ||
		normalized.startsWith('channel/') ||
		normalized.startsWith('c/') ||
		normalized.startsWith('user/') ||
		/^[A-Za-z0-9._-]+$/.test(normalized)
	) {
		return normalized;
	}

	return null;
}

/**
 * Extract a validated YouTube video ID from a watch query string or `/live/<id>` path.
 */
export function extractVideoIdFromLocation(locationLike: {
	pathname: string;
	search: string;
}): string | null {
	const queryVideoId = new URLSearchParams(locationLike.search).get('v');
	if (isValidYouTubeVideoId(queryVideoId)) {
		return queryVideoId;
	}

	const liveMatch = YOUTUBE_LIVE_PATH_RE.exec(locationLike.pathname);
	if (liveMatch && isValidYouTubeVideoId(liveMatch[1])) {
		return liveMatch[1];
	}

	return null;
}

/**
 * Safely read the mobile InnerTube client version string from inline page scripts,
 * without executing scripts or relying on DOM HTML injection.
 */
export function readMobileClientVersion(doc: Document | null): string {
	if (!doc || !doc.scripts) {
		return DEFAULT_MOBILE_CLIENT_VERSION;
	}

	for (const script of Array.from(doc.scripts)) {
		const content = script.textContent;
		if (!content || !content.includes('INNERTUBE_CLIENT_VERSION')) {
			continue;
		}
		const match = CLIENT_VERSION_EXTRACT_RE.exec(content);
		if (match && MOBILE_CLIENT_VERSION_RE.test(match[1])) {
			return match[1];
		}
	}

	return DEFAULT_MOBILE_CLIENT_VERSION;
}

/**
 * Extract plain text from a YouTube text container (`runs`, `simpleText`, or `content`).
 */
function extractTextFromContainer(
	container: unknown,
	preserveFormatting = false,
): string | null {
	if (typeof container === 'string') {
		return preserveFormatting
			? container.trim() || null
			: toNonEmptyTrimmedString(container);
	}

	if (!isRecord(container)) {
		return null;
	}

	if (typeof container.content === 'string') {
		return preserveFormatting
			? container.content.trim() || null
			: toNonEmptyTrimmedString(container.content);
	}

	if (typeof container.simpleText === 'string') {
		return preserveFormatting
			? container.simpleText.trim() || null
			: toNonEmptyTrimmedString(container.simpleText);
	}

	if (Array.isArray(container.runs)) {
		const joined = container.runs
			.map((run) =>
				isRecord(run) && typeof run.text === 'string' ? run.text : '',
			)
			.join('');
		return preserveFormatting
			? joined.trim() || null
			: toNonEmptyTrimmedString(joined);
	}

	return null;
}

/**
 * Extract normalized channel ID from a YouTube navigation endpoint or innertubeCommand.
 */
function extractChannelIdFromEndpoint(endpoint: unknown): string | null {
	if (!isRecord(endpoint)) {
		return null;
	}

	const browseEndpoint = isRecord(endpoint.browseEndpoint)
		? endpoint.browseEndpoint
		: null;
	if (browseEndpoint) {
		const canonical = normalizeChannelId(
			typeof browseEndpoint.canonicalBaseUrl === 'string'
				? browseEndpoint.canonicalBaseUrl
				: null,
		);
		if (canonical) {
			return canonical;
		}
	}

	const commandMetadata = isRecord(endpoint.commandMetadata)
		? endpoint.commandMetadata
		: null;
	const webMetadata =
		commandMetadata && isRecord(commandMetadata.webCommandMetadata)
			? commandMetadata.webCommandMetadata
			: null;
	if (webMetadata && typeof webMetadata.url === 'string') {
		const webUrlId = normalizeChannelId(webMetadata.url);
		if (webUrlId) {
			return webUrlId;
		}
	}

	if (
		browseEndpoint &&
		typeof browseEndpoint.browseId === 'string' &&
		YOUTUBE_BROWSE_ID_RE.test(browseEndpoint.browseId)
	) {
		return `channel/${browseEndpoint.browseId}`;
	}

	return null;
}

/**
 * Extract channel ID from `runs[].navigationEndpoint` when owner endpoint is nested inside runs.
 */
function extractChannelIdFromRuns(titleContainer: unknown): string | null {
	if (!isRecord(titleContainer) || !Array.isArray(titleContainer.runs)) {
		return null;
	}

	for (const run of titleContainer.runs) {
		if (!isRecord(run)) {
			continue;
		}
		const id = extractChannelIdFromEndpoint(run.navigationEndpoint);
		if (id) {
			return id;
		}
	}

	return null;
}

interface OwnerInfo {
	channelName: string | null;
	channelId: string | null;
}

function extractFromSlimOwnerRenderer(renderer: unknown): OwnerInfo {
	if (!isRecord(renderer)) {
		return { channelName: null, channelId: null };
	}
	const channelName = extractTextFromContainer(renderer.title);
	const channelId =
		extractChannelIdFromEndpoint(renderer.navigationEndpoint) ??
		extractChannelIdFromRuns(renderer.title);
	return { channelName, channelId };
}

function extractFromCompactChannelBar(viewModel: unknown): OwnerInfo {
	if (!isRecord(viewModel)) {
		return { channelName: null, channelId: null };
	}

	const rawBar = viewModel.channelBar;
	if (!isRecord(rawBar)) {
		return { channelName: null, channelId: null };
	}

	const compactBar = isRecord(rawBar.compactChannelBarViewModel)
		? rawBar.compactChannelBarViewModel
		: rawBar;

	const headerWrapper = compactBar.channelBarHeader;
	if (!isRecord(headerWrapper)) {
		return { channelName: null, channelId: null };
	}

	const header = isRecord(headerWrapper.channelBarHeaderViewModel)
		? headerWrapper.channelBarHeaderViewModel
		: headerWrapper;

	const channelName =
		extractTextFromContainer(header.title) ??
		extractTextFromContainer(header.attributedTitle);

	const onTap = isRecord(header.onTap) ? header.onTap : null;
	const channelId = extractChannelIdFromEndpoint(onTap?.innertubeCommand);

	return { channelName, channelId };
}

function extractChaptersFromNextPayload(
	payload: Record<string, unknown>,
): YouTubeChapter[] {
	const playerOverlays = isRecord(payload.playerOverlays)
		? payload.playerOverlays
		: null;
	const playerOverlayRenderer =
		playerOverlays && isRecord(playerOverlays.playerOverlayRenderer)
			? playerOverlays.playerOverlayRenderer
			: null;
	const decoratedOuter =
		playerOverlayRenderer &&
		isRecord(playerOverlayRenderer.decoratedPlayerBarRenderer)
			? playerOverlayRenderer.decoratedPlayerBarRenderer
			: null;
	const decoratedInner =
		decoratedOuter && isRecord(decoratedOuter.decoratedPlayerBarRenderer)
			? decoratedOuter.decoratedPlayerBarRenderer
			: decoratedOuter;
	const playerBar =
		decoratedInner && isRecord(decoratedInner.playerBar)
			? decoratedInner.playerBar
			: null;
	const multiMarkers =
		playerBar && isRecord(playerBar.multiMarkersPlayerBarRenderer)
			? playerBar.multiMarkersPlayerBarRenderer
			: null;
	const markersMap = multiMarkers?.markersMap;
	if (!Array.isArray(markersMap)) {
		return [];
	}

	const chapters: YouTubeChapter[] = [];
	for (const marker of markersMap) {
		if (!isRecord(marker) || marker.key !== 'DESCRIPTION_CHAPTERS') {
			continue;
		}
		const value = isRecord(marker.value) ? marker.value : null;
		const rawChapters = value?.chapters;
		if (!Array.isArray(rawChapters)) {
			continue;
		}
		for (const item of rawChapters) {
			if (!isRecord(item) || !isRecord(item.chapterRenderer)) {
				continue;
			}
			const renderer = item.chapterRenderer;
			const title = extractTextFromContainer(renderer.title);
			const startRaw = renderer.timeRangeStartMillis;
			let startMs = NaN;
			if (typeof startRaw === 'number') {
				startMs = startRaw;
			} else if (typeof startRaw === 'string' && startRaw.trim() !== '') {
				startMs = Number(startRaw);
			}

			if (title && Number.isFinite(startMs) && startMs >= 0) {
				chapters.push({ title, timeRangeStartMillis: startMs });
			}
		}
		break;
	}

	chapters.sort((a, b) => a.timeRangeStartMillis - b.timeRangeStartMillis);
	return chapters;
}

/**
 * Parse a YouTube InnerTube `/youtubei/v1/next` MWEB response into normalized
 * video metadata (title, channel name, channel ID, description, and description chapters).
 */
export function parseMobileNextResponse(payload: unknown): MobileNextVideoData {
	const empty: MobileNextVideoData = {
		title: null,
		channelName: null,
		channelId: null,
		description: null,
		chapters: [],
	};

	if (!isRecord(payload)) {
		return empty;
	}

	let title: string | null = null;
	let channelName: string | null = null;
	let channelId: string | null = null;
	let description: string | null = null;

	const contentsRoot = isRecord(payload.contents) ? payload.contents : null;
	const singleColumn =
		contentsRoot && isRecord(contentsRoot.singleColumnWatchNextResults)
			? contentsRoot.singleColumnWatchNextResults
			: null;
	const resultsOuter =
		singleColumn && isRecord(singleColumn.results)
			? singleColumn.results
			: null;
	const resultsInner =
		resultsOuter && isRecord(resultsOuter.results)
			? resultsOuter.results
			: null;
	const resultItems = Array.isArray(resultsInner?.contents)
		? resultsInner.contents
		: [];

	for (const entry of resultItems) {
		if (!isRecord(entry)) {
			continue;
		}

		if (isRecord(entry.slimVideoMetadataSectionRenderer)) {
			const sectionContents =
				entry.slimVideoMetadataSectionRenderer.contents;
			if (Array.isArray(sectionContents)) {
				for (const item of sectionContents) {
					if (!isRecord(item)) {
						continue;
					}
					if (!title && isRecord(item.slimVideoInformationRenderer)) {
						title = extractTextFromContainer(
							item.slimVideoInformationRenderer.title,
						);
					}
					if (!title && isRecord(item.videoMetadataViewModel)) {
						title = extractTextFromContainer(
							item.videoMetadataViewModel.title,
						);
					}
					if (isRecord(item.slimOwnerRenderer)) {
						const owner = extractFromSlimOwnerRenderer(
							item.slimOwnerRenderer,
						);
						channelName ??= owner.channelName;
						channelId ??= owner.channelId;
					}
					if (isRecord(item.compactifyVideoActionBarViewModel)) {
						const owner = extractFromCompactChannelBar(
							item.compactifyVideoActionBarViewModel,
						);
						channelName ??= owner.channelName;
						channelId ??= owner.channelId;
					}
					if (
						!description &&
						isRecord(item.slimVideoDescriptionRenderer)
					) {
						description = extractTextFromContainer(
							item.slimVideoDescriptionRenderer.description,
							true,
						);
					}
				}
			}
		}

		if (isRecord(entry.itemSectionRenderer)) {
			const sectionContents = entry.itemSectionRenderer.contents;
			if (Array.isArray(sectionContents)) {
				for (const item of sectionContents) {
					if (
						!isRecord(item) ||
						!isRecord(item.slimVideoMetadataRenderer)
					) {
						continue;
					}
					const legacy = item.slimVideoMetadataRenderer;
					if (!title) {
						title = extractTextFromContainer(legacy.title);
					}
					if (
						isRecord(legacy.owner) &&
						isRecord(legacy.owner.slimOwnerRenderer)
					) {
						const owner = extractFromSlimOwnerRenderer(
							legacy.owner.slimOwnerRenderer,
						);
						channelName ??= owner.channelName;
						channelId ??= owner.channelId;
					}
					if (!description) {
						description = extractTextFromContainer(
							legacy.description,
							true,
						);
					}
				}
			}
		}
	}

	const engagementPanels = Array.isArray(payload.engagementPanels)
		? payload.engagementPanels
		: [];
	for (const panel of engagementPanels) {
		if (
			!isRecord(panel) ||
			!isRecord(panel.engagementPanelSectionListRenderer)
		) {
			continue;
		}
		const epRenderer = panel.engagementPanelSectionListRenderer;
		if (epRenderer.panelIdentifier !== 'video-description-ep-identifier') {
			continue;
		}
		const content = isRecord(epRenderer.content)
			? epRenderer.content
			: null;
		const structuredDesc =
			content && isRecord(content.structuredDescriptionContentRenderer)
				? content.structuredDescriptionContentRenderer
				: null;
		const items = Array.isArray(structuredDesc?.items)
			? structuredDesc.items
			: [];

		for (const item of items) {
			if (!isRecord(item)) {
				continue;
			}
			if (isRecord(item.videoDescriptionHeaderRenderer)) {
				const header = item.videoDescriptionHeaderRenderer;
				if (!title) {
					title = extractTextFromContainer(header.title);
				}
				if (!channelName) {
					channelName = extractTextFromContainer(header.channel);
				}
				if (!channelId) {
					channelId = extractChannelIdFromEndpoint(
						header.channelNavigationEndpoint,
					);
				}
			}
			if (
				!description &&
				isRecord(item.expandableVideoDescriptionBodyRenderer)
			) {
				const body = item.expandableVideoDescriptionBodyRenderer;
				description =
					extractTextFromContainer(
						body.attributedDescriptionBodyText,
						true,
					) ??
					extractTextFromContainer(body.descriptionBodyText, true);
			}
		}
	}

	const chapters = extractChaptersFromNextPayload(payload);

	return {
		title,
		channelName,
		channelId,
		description,
		chapters,
	};
}

/**
 * Determine active chapter title from sorted `DESCRIPTION_CHAPTERS` entries
 * for the given playback position in seconds.
 */
export function getActiveChapterTitle(
	chapters: readonly YouTubeChapter[],
	currentTimeSeconds: number,
): string | null {
	if (
		chapters.length === 0 ||
		!Number.isFinite(currentTimeSeconds) ||
		currentTimeSeconds < 0
	) {
		return null;
	}

	const currentMs = currentTimeSeconds * 1000;
	let activeTitle: string | null = null;

	for (const chapter of chapters) {
		if (chapter.timeRangeStartMillis <= currentMs) {
			activeTitle = chapter.title;
		} else {
			break;
		}
	}

	return activeTitle;
}

/**
 * Linear-time JSON string property extractor avoiding regex backtracking on large HTML payloads.
 */
function extractJsonStringField(
	rawText: string,
	propertyName: string,
	startOffset = 0,
): string | null {
	const keyToken = `"${propertyName}"`;
	let searchFrom = Math.max(0, startOffset);

	while (searchFrom < rawText.length) {
		const keyIdx = rawText.indexOf(keyToken, searchFrom);
		if (keyIdx === -1) {
			return null;
		}

		let cursor = keyIdx + keyToken.length;
		while (
			cursor < rawText.length &&
			(rawText[cursor] === ' ' ||
				rawText[cursor] === '\t' ||
				rawText[cursor] === '\n' ||
				rawText[cursor] === '\r')
		) {
			cursor++;
		}

		if (rawText[cursor] !== ':') {
			searchFrom = keyIdx + keyToken.length;
			continue;
		}

		cursor++;
		while (
			cursor < rawText.length &&
			(rawText[cursor] === ' ' ||
				rawText[cursor] === '\t' ||
				rawText[cursor] === '\n' ||
				rawText[cursor] === '\r')
		) {
			cursor++;
		}

		if (rawText[cursor] !== '"') {
			searchFrom = cursor;
			continue;
		}

		const stringStart = cursor;
		const scanLimit = Math.min(
			rawText.length,
			stringStart + MAX_JSON_STRING_SCAN,
		);
		let escaped = false;
		cursor++;

		while (cursor < scanLimit) {
			const ch = rawText[cursor];
			if (escaped) {
				escaped = false;
			} else if (ch === '\\') {
				escaped = true;
			} else if (ch === '"') {
				const rawLiteral = rawText.slice(stringStart, cursor + 1);
				try {
					const decoded: unknown = JSON.parse(rawLiteral);
					if (typeof decoded === 'string') {
						return decoded;
					}
				} catch {
					// Malformed escape; continue scanning
				}
				break;
			}
			cursor++;
		}

		searchFrom = cursor + 1;
	}

	return null;
}

/**
 * Extract video `category` and `shortDescription` from YouTube watch page HTML
 * in linear time without regex backtracking risks.
 */
export function extractCategoryAndDescriptionFromWatchHtml(
	rawHtml: string,
): WatchVideoMetadata {
	if (typeof rawHtml !== 'string' || rawHtml.length === 0) {
		return { category: null, shortDescription: null };
	}

	const mfObjectIdx = rawHtml.indexOf('"playerMicroformatRenderer":{');
	const category =
		(mfObjectIdx !== -1
			? extractJsonStringField(rawHtml, 'category', mfObjectIdx)
			: null) ?? extractJsonStringField(rawHtml, 'category', 0);

	const videoDetailsIdx = rawHtml.indexOf('"videoDetails":{');
	const shortDescriptionRaw =
		(videoDetailsIdx !== -1
			? extractJsonStringField(
					rawHtml,
					'shortDescription',
					videoDetailsIdx,
				)
			: null) ?? extractJsonStringField(rawHtml, 'shortDescription', 0);

	const shortDescription = shortDescriptionRaw
		? shortDescriptionRaw.trim() || null
		: null;

	return {
		category: toNonEmptyTrimmedString(category),
		shortDescription,
	};
}

/**
 * Recursively extract text from a DOM subtree preserving line breaks across `<br>` and block elements.
 * Works safely without CSS layout dependency (for hidden elements like `.ytmCrawlerDescriptionHost`)
 * and without `innerHTML` parsing.
 */
export function extractElementTextWithNewlines(
	root: Node | null | undefined,
): string | null {
	if (!root) {
		return null;
	}

	let result = '';

	function appendNewlineIfNeeded() {
		if (result.length > 0 && !result.endsWith('\n')) {
			result += '\n';
		}
	}

	function walk(node: Node) {
		if (node.nodeType === 3) {
			result += node.nodeValue ?? node.textContent ?? '';
			return;
		}

		if (node.nodeType !== 1) {
			return;
		}

		const tagName =
			typeof (node as Element).tagName === 'string'
				? (node as Element).tagName.toUpperCase()
				: '';

		if (IGNORED_ELEMENT_TAGS.has(tagName)) {
			return;
		}

		if (tagName === 'BR') {
			result += '\n';
			return;
		}

		const isBlock = BLOCK_ELEMENT_TAGS.has(tagName);
		if (isBlock) {
			appendNewlineIfNeeded();
		}

		if (node.childNodes) {
			for (let i = 0; i < node.childNodes.length; i++) {
				const child = node.childNodes[i];
				if (child) {
					walk(child);
				}
			}
		}

		if (isBlock) {
			appendNewlineIfNeeded();
		}
	}

	walk(root);

	const normalized = result.replace(/\r\n/g, '\n').trim();
	return normalized.length > 0 ? normalized : null;
}

/**
 * Perform a fetch wrapped with an abort timeout AND optional parent navigation abort signal.
 * Distinguishes navigation cancellation (`status: 'aborted'`) from timeouts/network failures (`status: 'error'`).
 */
async function fetchWithTimeoutAndCancellation(
	url: string,
	init: RequestInit,
	navigationSignal?: AbortSignal,
	timeoutMs = FETCH_TIMEOUT_MS,
): Promise<
	| { status: 'ok'; response: Response }
	| { status: 'aborted' }
	| { status: 'error'; reason: string }
> {
	if (navigationSignal?.aborted) {
		return { status: 'aborted' };
	}

	const controller = new AbortController();
	let timedOut = false;

	const timeoutId = setTimeout(() => {
		timedOut = true;
		controller.abort();
	}, timeoutMs);

	const onParentAbort = () => {
		controller.abort();
	};
	navigationSignal?.addEventListener('abort', onParentAbort, { once: true });

	try {
		const response = await fetch(url, {
			...init,
			signal: controller.signal,
		});
		if (navigationSignal?.aborted && !timedOut) {
			return { status: 'aborted' };
		}
		if (!response.ok) {
			return { status: 'error', reason: `HTTP ${response.status}` };
		}
		return { status: 'ok', response };
	} catch (err) {
		if (navigationSignal?.aborted && !timedOut) {
			return { status: 'aborted' };
		}
		const message = err instanceof Error ? err.message : String(err);
		return { status: 'error', reason: message };
	} finally {
		clearTimeout(timeoutId);
		navigationSignal?.removeEventListener('abort', onParentAbort);
	}
}

/**
 * Fetch mobile watch metadata (`title`, `channelName`, `channelId`, `description`, `chapters`)
 * via same-origin YouTube InnerTube `/youtubei/v1/next` endpoint.
 */
export async function fetchMobileNextData(
	origin: string,
	videoId: string,
	clientVersion: string,
	navigationSignal?: AbortSignal,
	language = 'en',
): Promise<FetchResult<MobileNextVideoData>> {
	const safeOrigin = parseAllowedYouTubeOrigin(origin);
	if (!safeOrigin || !isValidYouTubeVideoId(videoId)) {
		return { status: 'error', reason: 'Invalid origin or videoId' };
	}

	const safeClientVersion = MOBILE_CLIENT_VERSION_RE.test(clientVersion)
		? clientVersion
		: DEFAULT_MOBILE_CLIENT_VERSION;
	const safeLanguage = /^[A-Za-z-]{2,15}$/.test(language) ? language : 'en';

	const body = JSON.stringify({
		context: {
			client: {
				clientName: 'MWEB',
				clientVersion: safeClientVersion,
				hl: safeLanguage,
			},
		},
		videoId,
	});

	const fetchRes = await fetchWithTimeoutAndCancellation(
		`${safeOrigin}/youtubei/v1/next`,
		{
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
			},
			body,
		},
		navigationSignal,
	);

	if (fetchRes.status !== 'ok') {
		return fetchRes;
	}

	try {
		const json: unknown = await fetchRes.response.json();
		if (navigationSignal?.aborted) {
			return { status: 'aborted' };
		}
		return { status: 'ok', data: parseMobileNextResponse(json) };
	} catch (err) {
		if (navigationSignal?.aborted) {
			return { status: 'aborted' };
		}
		const message = err instanceof Error ? err.message : String(err);
		return { status: 'error', reason: message };
	}
}

/**
 * Fetch watch page HTML from validated same-origin YouTube URL and extract `category` and `shortDescription`.
 */
export async function fetchWatchVideoMetadata(
	origin: string,
	videoId: string,
	navigationSignal?: AbortSignal,
): Promise<FetchResult<WatchVideoMetadata>> {
	const safeOrigin = parseAllowedYouTubeOrigin(origin);
	if (!safeOrigin || !isValidYouTubeVideoId(videoId)) {
		return { status: 'error', reason: 'Invalid origin or videoId' };
	}

	const videoUrl = `${safeOrigin}/watch?v=${encodeURIComponent(videoId)}`;
	const fetchRes = await fetchWithTimeoutAndCancellation(
		videoUrl,
		{ credentials: 'same-origin' },
		navigationSignal,
	);

	if (fetchRes.status !== 'ok') {
		return fetchRes;
	}

	try {
		const rawHtml = await fetchRes.response.text();
		if (navigationSignal?.aborted) {
			return { status: 'aborted' };
		}
		return {
			status: 'ok',
			data: extractCategoryAndDescriptionFromWatchHtml(rawHtml),
		};
	} catch (err) {
		if (navigationSignal?.aborted) {
			return { status: 'aborted' };
		}
		const message = err instanceof Error ? err.message : String(err);
		return { status: 'error', reason: message };
	}
}

/**
 * Fetch track recognition status and metadata from YouTube Music InnerTube `/player` API.
 */
export async function fetchYouTubeMusicInfo(
	videoId: string,
	navigationSignal?: AbortSignal,
): Promise<FetchResult<YouTubeMusicCacheEntry>> {
	if (!isValidYouTubeVideoId(videoId)) {
		return { status: 'error', reason: 'Invalid videoId' };
	}

	const body = JSON.stringify({
		context: {
			client: {
				clientName: YOUTUBE_MUSIC_CLIENT_NAME,
				clientVersion: YOUTUBE_MUSIC_CLIENT_VERSION,
			},
		},
		captionParams: {},
		videoId,
	});

	const fetchRes = await fetchWithTimeoutAndCancellation(
		YOUTUBE_MUSIC_PLAYER_URL,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body,
		},
		navigationSignal,
	);

	if (fetchRes.status !== 'ok') {
		return fetchRes;
	}

	try {
		const json: unknown = await fetchRes.response.json();
		if (navigationSignal?.aborted) {
			return { status: 'aborted' };
		}
		if (!isRecord(json) || !isRecord(json.videoDetails)) {
			return {
				status: 'ok',
				data: {
					done: true,
					recognisedByYtMusic: false,
				},
			};
		}

		const { videoDetails } = json;
		const musicVideoType =
			typeof videoDetails.musicVideoType === 'string'
				? videoDetails.musicVideoType
				: null;
		const recognisedByYtMusic =
			musicVideoType?.startsWith('MUSIC_VIDEO_') ?? false;

		const entry: YouTubeMusicCacheEntry = {
			done: true,
			recognisedByYtMusic,
		};

		if (musicVideoType === 'MUSIC_VIDEO_TYPE_OMV') {
			const artist =
				typeof videoDetails.author === 'string'
					? videoDetails.author
					: null;
			const track =
				typeof videoDetails.title === 'string'
					? videoDetails.title
					: null;
			if (artist || track) {
				entry.currentTrackInfo = {
					...(artist ? { artist } : {}),
					...(track ? { track } : {}),
				};
			}
		}

		return { status: 'ok', data: entry };
	} catch (err) {
		if (navigationSignal?.aborted) {
			return { status: 'aborted' };
		}
		const message = err instanceof Error ? err.message : String(err);
		return { status: 'error', reason: message };
	}
}
