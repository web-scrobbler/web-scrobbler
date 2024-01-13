'use strict';

import type {
	ArtistTrackInfo,
	BaseState,
	State,
	TimeInfo,
	TrackInfoWithAlbum,
} from '@/core/types';
import type { ConnectorOptions } from '@/core/storage/options';
import type { ControllerModeStr } from '@/core/object/controller/controller';
import type { DebugLogType } from '@/util/util';

import { t } from '@/util/i18n';
import * as ControllerMode from '@/core/object/controller/controller-mode';
import Song from '../object/song';

const BrowserStorage = (async () => {
	return import('@/core/storage/browser-storage');
})();

const Options = (async () => {
	return import('@/core/storage/options');
})();

/**
 * All the separators used by the core and by connectors.
 * This can be expanded just fine, do so if you run into trouble while developing a connector.
 */
export type Separator =
	| ' -- '
	| '--'
	| ' ~ '
	| ' \u002d '
	| ' \u2013 '
	| ' \u2014 '
	| ' \u2022 '
	| ' // '
	| '\u002d'
	| '\u2013'
	| '\u2014'
	| ':'
	| '|'
	| '///'
	| '/'
	| '~'
	| ' | '
	| '<br/>'
	| ' by '
	| ', '
	| '·'
	| ' ·';

/**
 * Separator used to join array of artist names into a single string.
 */
export const ARTIST_SEPARATOR = ', ';

/**
 * Default array of separators used to split artist and track info.
 * Push new separators in the implementation if required.
 */
export const defaultSeparators = [
	' -- ',
	'--',
	' ~ ',
	' \u002d ',
	' \u2013 ',
	' \u2014 ',
	' // ',
	'\u002d',
	'\u2013',
	'\u2014',
	':',
	'|',
	'///',
	'/',
	'~',
];

/**
 * Convert given time-string into seconds.
 * @param str - Time-string in h:m:s format
 * @returns Seconds
 */
export function stringToSeconds(str: string | null | undefined): number {
	const timeFormatExpression =
		/^\s*-?((\d{1,2}:\d\d:\d\d)|(\d{1,2}:\d\d)|(\d{1,2}))\s*$/g;
	if (!str || !timeFormatExpression.test(str)) {
		return 0;
	}

	const negativeExpression = /-/g;
	const digitsExpression = /\d{1,2}/g;

	const seconds = str
		.match(digitsExpression)
		?.reverse()
		.map((current) => parseInt(current, 10))
		.reduce((total, current, i) => total + current * Math.pow(60, i));

	return seconds && negativeExpression.test(str) ? -seconds : seconds ?? 0;
}

/**
 * Find first occurence of possible separator in given string
 * and return separator's position and size in chars or null.
 * @param str - String containing separator
 * @param separators - Array of separators
 * @returns Object containing position and width of separator
 */
export function findSeparator(
	str: string | null,
	separators: Separator[] | null = null,
): { index: number; length: number } | null {
	if (str === null || str.length === 0) {
		return null;
	}

	for (const sep of separators || defaultSeparators) {
		const index = str.indexOf(sep);
		if (index > -1) {
			return { index, length: sep.length };
		}
	}

	return null;
}

/**
 * Join array of artist name into a string. The array must contain objects
 * that have 'textContent' property (DOM node).
 * @param artists - Array of DOM nodes
 * @returns String joined by separator or null
 */
export function joinArtists(artists: Node[]): string | null {
	if (!artists || artists.length === 0) {
		return null;
	}

	return artists
		.map((artist) => {
			return artist.textContent;
		})
		.join(ARTIST_SEPARATOR);
}

/**
 * Split string to artist and track.
 * @param str - String containing artist and track
 * @param separators - Array of separators
 * @param swap - Should swap artist and track values
 * @returns Object contains artist and track fields
 */
export function splitArtistTrack(
	str: string | null | undefined,
	separators: Separator[] | null = null,
	swap = false,
): ArtistTrackInfo {
	if (!str) {
		return { artist: null, track: null };
	}
	const [artist, track] = splitString(str, separators, swap);
	return { artist, track };
}

/**
 * Regular Expression to detect record side in track title
 */
export const RECORD_SIDE_REGEX = /^[A-Z][1-9]\.? /;

/**
 * Remove record side from track title.
 * @param str - String containing track title
 * @returns Track title without record side
 */
export function removeRecordSide(str: string | null): string | null {
	if (str !== null) {
		return str.replace(RECORD_SIDE_REGEX, '');
	}
	return null;
}

/**
 * Split string to artist and album.
 * @param str - String containing artist and track
 * @param separators - Array of separators
 * @param swap - Should swap artist and track values
 * @returns Object containing artist and track fields
 */
export function splitArtistAlbum(
	str: string | null | undefined,
	separators: Separator[] | null = null,
	swap = false,
): { artist: string | null; album: string | null } {
	const [artist, album] = splitString(str, separators, swap);
	return { artist, album };
}

/**
 * Split string to current time and duration.
 * @param str - String containing current time and duration
 * @param separator - Separator
 * @param swap - Should swap currentTime and duration values
 * @returns Array containing 'currentTime' and 'duration' fields
 */
export function splitTimeInfo(
	str: string | null,
	separator: Separator = '/',
	swap = false,
): TimeInfo {
	if (str === null) {
		return {
			currentTime: undefined,
			duration: undefined,
		};
	}
	const [currentTime, duration] = splitString(str, [separator], swap).map(
		(e) => stringToSeconds(e),
	);

	return { currentTime, duration };
}

/**
 * Split string to two ones using array of separators.
 * @param str - Any string
 * @param separators - Array of separators
 * @param swap - Swap values
 * @returns Array of strings splitted by separator
 */
export function splitString(
	str: string | null | undefined,
	separators: Separator[] | null,
	swap = false,
): [string | null, string | null] {
	let first = null;
	let second = null;

	if (str) {
		const separator = findSeparator(str, separators);

		if (separator !== null) {
			first = str.substr(0, separator.index);
			second = str.substr(separator.index + separator.length);

			if (swap) {
				[second, first] = [first, second];
			}
		}
	}

	return [first, second];
}

/**
 * Verify time value and return time as a Number object.
 * Return null value if time value is not a number.
 * @param time - Time value
 * @returns time value as a Number object
 */
export function escapeBadTimeValues(time: unknown): number | null {
	if (typeof time !== 'number') {
		return null;
	}
	if (isNaN(time) || !isFinite(time)) {
		return null;
	}
	return Math.round(time);
}

/**
 * Extract track art URL from CSS property.
 * @param cssProperty - CSS property
 * @returns Track art URL
 */
export function extractUrlFromCssProperty(
	cssProperty: string | null | undefined,
): string | null {
	if (!cssProperty) {
		return null;
	}
	const match = /url\((["']?)(.*)\1\)/.exec(cssProperty);
	if (match) {
		return match[2].trim();
	}
	return null;
}

/**
 * Returns a function, that, when invoked, will only be triggered
 * at most once during a given window of time.
 *
 * @param func - Function to be throttled
 * @param wait - Time before function calls
 * @returns Throttled function
 */
export function throttle<T>(func: () => T, wait: number): () => T | undefined {
	let prev = 0;
	let timeout = setTimeout(() => {
		// do nothing
	}, 0);

	return () => {
		const now = Date.now();
		const remaining = wait - (now - prev);
		if (remaining <= 0) {
			prev = now;
			return func();
		}
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			prev = Date.now();
			func();
		}, remaining);
	};
}

/**
 * Check if given 'artistTrack' object is empty. The object means empty
 * if its 'artist' and 'track' properties are undefined, null or empty.
 * @param artistTrack - Object contains artist and track info
 * @returns True if object is empty; false otherwise
 */
export function isArtistTrackEmpty(
	artistTrack: ArtistTrackInfo | null,
): boolean {
	return !(artistTrack && artistTrack.artist && artistTrack.track);
}

/**
 * Fill fields of a target object with non-empty field values
 * of a source object.
 *
 * @param target - Target object
 * @param source - Source object
 * @param fields - List of fields to fill
 */
export function fillEmptyFields(
	target: State,
	source: State | null | undefined,
	fields: (keyof State)[] | undefined,
): State {
	if (!source || !Array.isArray(fields)) {
		return target;
	}

	for (const field of fields) {
		if (!target[field] && source[field]) {
			// @ts-expect-error - TS is a little confused here too
			target[field] = source[field];
		}
	}

	return target;
}

/**
 * Get track info from MediaSession object.
 *
 * @param mediaSession - MediaSession instance
 * @returns Track info
 */
export function getMediaSessionInfo(
	mediaSession: MediaSession,
): BaseState | null {
	if (!(mediaSession && mediaSession.metadata)) {
		return null;
	}

	const { artist, album, title, artwork } = mediaSession.metadata;

	const track = title;
	let trackArt = null;
	if (artwork?.length > 0) {
		const { src } = artwork[artwork.length - 1];
		trackArt = src;
	}

	return { artist, track, album, trackArt };
}

/** Browser-related helper functions. */

/**
 * Return text of first available element. If `selectors` is a string,
 * return text of element with given selector. If `selectors` is
 * an array, return text of first available element.
 * @param selectors - Single selector or array of selectors
 * @param defaultValue - Fallback value
 * @returns Text of element, if available, or default value
 */
/* istanbul ignore next */
export function getTextFromSelectors(
	selectors: string | string[] | null,
	defaultValue: string | null = null,
): string | null {
	if (selectors === null) {
		return defaultValue;
	}
	const elements = queryElements(selectors);

	if (!elements) {
		return defaultValue;
	}

	for (const element of elements) {
		const text = element.innerText;
		if (text) {
			return text;
		}
	}

	return defaultValue;
}

/**
 * Return a text value of a first available element. If `selectors` is
 * a string, return the attribute value of an element matching by
 * the selector. If `selectors` is an array, return the attribute value of
 * a first element with the attribute available.
 *
 * @param selectors - Single selector or array of selectors
 * @param attr - Attrubute to get
 * @param defaultValue - Fallback value
 * @returns Text of element, if available, or default value
 */
/* istanbul ignore next */
export function getAttrFromSelectors(
	selectors: string | string[] | null,
	attr: string,
	defaultValue: string | null = null,
): string | null {
	if (selectors === null) {
		return defaultValue;
	}
	const elements = queryElements(selectors);

	if (elements) {
		if (elements.length === 1) {
			return elements[0].getAttribute(attr);
		}

		for (const element of elements) {
			const attrValue = element.getAttribute(attr);
			if (attrValue) {
				return attrValue;
			}
		}
	}

	return defaultValue;
}

/**
 * Bind event listeners to elements matching selectors
 *
 * @param selectors - Single selector or array of selectors
 * @param events - Single event or array of events to bind
 * @param fn - Function to bind
 */
export function bindListeners(
	selectors: string | string[],
	events: string | string[],
	fn: (e: Event) => void,
) {
	const elements = queryElements(selectors);
	if (!elements) {
		return;
	}
	for (const element of elements) {
		if (typeof events === 'string') {
			element.addEventListener(events, fn);
		} else {
			for (const event of events) {
				element.addEventListener(event, fn);
			}
		}
	}
}

/**
 * Extract time in seconds from first available element
 * defined by CSS selector.
 *
 * @param selectors - Single selector or array of selectors
 * @returns Seconds
 */
/* istanbul ignore next */
export function getSecondsFromSelectors(
	selectors: string | string[] | null,
): number | undefined {
	return stringToSeconds(getTextFromSelectors(selectors) ?? '');
}

/**
 * Extract image URL from first available element defined by CSS selector.
 * @param selectors - Single selector or array of selectors
 * @returns Track art URL
 */
/* istanbul ignore next */
export function extractImageUrlFromSelectors(
	selectors: string | string[] | null,
): string | null {
	if (selectors === null) {
		return null;
	}
	const elements = queryElements(selectors);
	if (!elements || !elements.length) {
		return null;
	}

	let trackArtUrl: string | null = elements[0].getAttribute('src');
	if (!trackArtUrl) {
		const cssProperties = ['background-image', 'background'];
		const style = window.getComputedStyle(elements[0]);
		for (const property of cssProperties) {
			const propertyValue = style.getPropertyValue(property);
			if (propertyValue) {
				trackArtUrl = extractUrlFromCssProperty(propertyValue);
			}
		}
	}

	return normalizeUrl(trackArtUrl);
}

/**
 * Get value of CSS property of an element by selectors
 *
 * @param selectors - Single selector or array of selectors
 * @param property - CSS property to get value of
 * @returns value of CSS property
 */
export function getCSSPropertyFromSelectors(
	selectors: string | string[],
	property: string,
) {
	const elements = queryElements(selectors);
	if (!elements) {
		return null;
	}
	for (const element of elements) {
		const value = getCSSProperty(element, property);
		if (value) {
			return value;
		}
	}
	return null;
}

/**
 * Get value of CSS property of an element
 */
export function getCSSProperty(element: Element, property: string) {
	const style = window.getComputedStyle(element);
	return style.getPropertyValue(property);
}

/**
 * Check if an element matching a given selector has a class.
 *
 * @param selectors - Single selector or array of selectors
 * @param cls - Class name to check
 * @returns Check result
 */
/* istanbul ignore next */
export function hasElementClass(
	selectors: string | string[] | null,
	cls: string,
): boolean {
	if (selectors === null) {
		return false;
	}
	const elements = queryElements(selectors);
	if (!elements) {
		return false;
	}
	for (const element of elements) {
		if (element.classList.contains(cls)) {
			return true;
		}
	}
	return false;
}

/**
 * Check if an array of HTML elements contains a visible element. Taken from JQuery
 *
 * @param elements - HTML elements to check
 * @returns Check result
 */
function visibleFilter(elements: NodeListOf<HTMLElement>) {
	for (const element of elements) {
		if (
			element.offsetWidth ||
			element.offsetHeight ||
			element.getClientRects().length
		) {
			return true;
		}
	}
	return false;
}

/**
 * Check if an element matching a given selector is visible.
 *
 * @param selectors - Single selector or array of selectors
 * @returns Check result
 */
/* istanbul ignore next */
export function isElementVisible(
	selectors: string | string[] | null | undefined,
): boolean {
	if (!selectors) {
		return false;
	}
	const element = queryElements(selectors);
	return (element && visibleFilter(element)) ?? false;
}

/**
 * Get value of the first element matching a given selector.
 *
 * @param selectors - Single selector or array of selectors
 * @returns Value, or null if not found
 */
export function getValueFromSelectors(
	selectors: string | string[],
): string | null {
	const element = queryElements(selectors);
	if (!element || !('value' in element)) {
		return null;
	}
	return element.value as string;
}

/**
 * Get value of data property for the first element matching a given selector.
 *
 * @param selectors - Single selector or array of selectors
 * @param name - Name of the data property to get value for
 * @returns Value, or null if not found
 */
export function getDataFromSelectors(
	selectors: string | string[],
	name: string,
): string | null {
	return getAttrFromSelectors(selectors, `data-${name}`);
}

/**
 * Return first available element. If `selectors` is a string, return
 * element with the selector. If `selectors` is an array, return
 * element matched by first valid selector.
 * @param selectors - Single selector or array of selectors
 * @returns HTML element
 */
/* istanbul ignore next */
export function queryElements(
	selectors: string | string[] | null | undefined,
): NodeListOf<HTMLElement> | null {
	if (!selectors) {
		return null;
	}

	if (typeof selectors === 'string') {
		return document.querySelectorAll(selectors);
	}

	if (!Array.isArray(selectors)) {
		throw new TypeError(`Unknown type of selector: ${typeof selectors}`);
	}

	for (const selector of selectors) {
		// eslint-disable-next-line
		const elements = document.querySelectorAll(
			selector,
		) as NodeListOf<HTMLElement>;
		if (elements.length > 0) {
			return elements;
		}
	}

	return null;
}

/**
 * Read connector option from storage.
 * @param connector - Connector name
 * @param key - Option key
 * @returns Option value
 */
/* istanbul ignore next */
export async function getOption(
	connector: string,
	key: string,
): Promise<boolean> {
	const awaitedStorage = await BrowserStorage;
	const data = await awaitedStorage
		.getStorage(awaitedStorage.CONNECTORS_OPTIONS)
		.get();
	if (
		data &&
		connector in data &&
		key in data[connector as keyof ConnectorOptions]
	) {
		return data[connector as keyof ConnectorOptions][
			key as keyof ConnectorOptions[keyof ConnectorOptions]
		];
	}
	debugLog(`Option ${key} for connector ${connector} not found`, 'warn');
	return false;
}

/**
 * Normalize given URL. Currently it only normalizes
 * protocol-relative and root-relative links.
 * @param url - URL, which is possibly relative
 * @returns Normalized URL
 */
/* istanbul ignore next */
export function normalizeUrl(url: string | null | undefined): string | null {
	if (!url) {
		return null;
	}

	if (url.startsWith('//')) {
		return location.protocol + url;
	}

	if (url.match(/^\/(?!\/)/g)) {
		return location.origin + url;
	}

	return url;
}

/**
 * Inject script into document.
 * @param scriptUrl - script URL
 */
/* istanbul ignore next */
export function injectScriptIntoDocument(scriptUrl: string): void {
	const script = document.createElement('script');
	script.src = scriptUrl;
	script.onload = function () {
		const e = this as HTMLScriptElement;
		e.parentNode?.removeChild(e);
	};
	(document.head || document.documentElement).appendChild(script);
}

/**
 * Handle async checks for DEBUG_LOGGING_ENABLED option while ensuring
 * that logs are still printed in a predictable order.
 */
class DebugLogQueue {
	private queue: { text: unknown; logType: DebugLogType }[] = [];
	private isActive = false;
	private shouldPrint = Options.then((awaitedOptions) =>
		awaitedOptions.getOption(awaitedOptions.DEBUG_LOGGING_ENABLED),
	);

	/**
	 * Enqueue a log message to be printed.
	 * @param text - Debug message
	 * @param logType - Log type
	 */
	public push(text: unknown, logType: DebugLogType): void {
		this.queue.push({ text, logType });
		this.start();
	}

	/**
	 * Process the queue to print logs in order.
	 */
	private async start(): Promise<void> {
		if (this.isActive) {
			return;
		}
		this.isActive = true;

		try {
			for (let i = 0; i < 100 && this.queue.length > 0; i++) {
				const currentMessage = this.queue.shift();
				if (currentMessage && (await this.shouldPrint)) {
					const logFunc = console[currentMessage.logType];

					if (typeof logFunc !== 'function') {
						throw new TypeError(
							`Unknown log type: ${currentMessage.logType}`,
						);
					}

					const message = `Web Scrobbler: ${currentMessage.text?.toString()}`;
					logFunc(message);
				}
			}
			this.isActive = false;
		} catch (err) {
			this.isActive = false;
		}
	}
}
const debugLogQueue = new DebugLogQueue();

/**
 * Print debug message with prefixed "Web Scrobbler" string.
 * @param text - Debug message
 * @param logType - Log type
 */
/* istanbul ignore next */
export function debugLog(text: unknown, logType: DebugLogType = 'log'): void {
	debugLogQueue.push(text, logType);
}

/** YouTube section. */

/**
 * Regular expression used to get Youtube video ID from URL. It covers
 * default, shortened and embed URLs.
 */
export const ytVideoIdRegExp =
	/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?.*v=))([^#&?]*).*/;

export const ytDescFirstLine = 'Provided to YouTube';

export const ytDescLastLine = 'Auto-generated by YouTube.';

export const ytDescSeparator = ' · ';

export const ytTitleRegExps = [
	// Artist "Track", Artist: "Track", Artist - "Track", etc.
	{
		pattern: /(.+?)([\s:—-])+\s*"(.+?)"/,
		groups: { artist: 1, track: 3 },
	},
	// Artist「Track」 (Japanese tracks)
	{
		pattern: /(.+?)[『｢「](.+?)[」｣』]/,
		groups: { artist: 1, track: 2 },
	},
	// Track (... by Artist)
	{
		pattern: /(\w[\s\w]*?)\s+\([^)]*\s*by\s*([^)]+)+\)/,
		groups: { artist: 2, track: 1 },
	},
];

/**
 * Extract artist and track from Youtube video title.
 * @param videoTitle - Youtube video title
 * @returns Object containing artist and track fields
 */
export function processYtVideoTitle(
	videoTitle: string | null | undefined,
): ArtistTrackInfo {
	let artist = null;
	let track = null;

	if (!videoTitle) {
		return { artist, track };
	}

	// Remove [genre] or 【genre】 from the beginning of the title
	let title = videoTitle.replace(/^((\[[^\]]+\])|(【[^】]+】))\s*-*\s*/i, '');

	// Remove track (CD and vinyl) numbers from the beginning of the title
	title = title.replace(/^\s*([a-zA-Z]{1,2}|[0-9]{1,2})[1-9]?\.\s+/i, '');

	// Remove - preceding opening bracket
	title = title.replace(/-\s*([「【『])/, '$1');

	// 【/(*Music Video/MV/PV*】/)
	title = title.replace(
		/[(［【][^(［【]*?((Music Video)|(MV)|(PV)).*?[】］)]/i,
		'',
	);

	// 【/(東方/オリジナル*】/)
	title = title.replace(/[(［【]((オリジナル)|(東方)).*?[】］)]+?/, '');

	// MV/PV if followed by an opening/closing bracket
	title = title.replace(/((?:Music Video)|MV|PV)([「［【『』】］」])/i, '$2');

	// MV/PV if ending and with whitespace in front
	title = title.replace(/\s+(MV|PV)$/i, '');

	// Try to match one of the regexps
	for (const regExp of ytTitleRegExps) {
		const artistTrack = regExp.pattern.exec(title);
		if (artistTrack) {
			artist = artistTrack[regExp.groups.artist];
			track = artistTrack[regExp.groups.track];
			break;
		}
	}

	// No match? Try splitting, then.
	if (isArtistTrackEmpty({ artist, track })) {
		({ artist, track } = splitArtistTrack(title));
	}

	// No match? Check for 【】
	if (isArtistTrackEmpty({ artist, track })) {
		const artistTrack = /(.+?)【(.+?)】/.exec(title);
		if (artistTrack) {
			artist = artistTrack[1];
			track = artistTrack[2];
		}
	}

	if (isArtistTrackEmpty({ artist, track })) {
		track = title;
	}

	return { artist, track };
}

export function isYtVideoDescriptionValid(desc: string | null): desc is string {
	return Boolean(
		desc &&
			(desc.startsWith(ytDescFirstLine) || desc.endsWith(ytDescLastLine)),
	);
}

export function parseYtVideoDescription(
	desc: string | null,
): TrackInfoWithAlbum | null {
	if (!isYtVideoDescriptionValid(desc)) {
		return null;
	}

	const lines = desc
		.split('\n')
		.filter((line) => {
			return line.length > 0;
		})
		.filter((line) => {
			return !line.startsWith(ytDescFirstLine);
		});

	const firstLine = lines[0];
	const secondLine = lines[1];

	const trackInfo = firstLine.split(ytDescSeparator);
	const numberOfFields = trackInfo.length;

	const album = secondLine;
	let artist = null;
	let track: string | null = null;
	let featArtists = null;

	if (numberOfFields < 2) {
		[track] = trackInfo;
	} else if (numberOfFields === 2) {
		[track, artist] = trackInfo;
	} else {
		[track, artist, ...featArtists] = trackInfo;

		const areFeatArtistPresent = featArtists.some(
			(artist) => track?.includes(artist),
		);
		if (!areFeatArtistPresent) {
			const featArtistsStr = featArtists.join(ARTIST_SEPARATOR);
			track = `${track} (feat. ${featArtistsStr})`;
		}
	}

	return { artist, track, album };
}

/**
 * Parse given video URL and return video ID.
 * @param videoUrl - Video URL
 * @returns Video ID
 */
export function getYtVideoIdFromUrl(videoUrl: string | null): string | null {
	if (!videoUrl) {
		return null;
	}

	const match = ytVideoIdRegExp.exec(videoUrl);
	if (match) {
		return match[7];
	}

	return null;
}

/** SoundCloud section. */

/**
 * Regular expression used to split artist and track.
 */
export const scArtistTrackRe = /(.+)\s[:\u2013-\u2015-]\s(.+)/;

/**
 * Extract artist and track from SoundCloud track title.
 * @param track - SoundCloud track title
 * @returns Object contains artist and track fields
 */
export function processSoundCloudTrack(
	track: string | null | undefined,
): ArtistTrackInfo {
	if (!track) {
		return { artist: null, track: null };
	}
	/*
	 * Sometimes the artist name is in the track title,
	 * e.g. Tokyo Rose - Zender Overdrive by Aphasia Records.
	 */
	const match = scArtistTrackRe.exec(track);

	/*
	 * But don't interpret patterns of the form
	 * "[Start of title] #1234 - [End of title]" as Artist - Title
	 */
	if (match && !/.*#\d+.*/.test(match[1])) {
		return {
			artist: match[1],
			track: match[2],
		};
	}

	return { artist: null, track };
}

/**
 * Get the origin URL from selector, falling back to the document location on failure.
 * @param selector - A string containing one or more selectors to match. Must be a valid CSS selector string.
 * @returns href attribute of the first matching element. Defaults to the current browser location.
 */
export function getOriginUrl(selector: string): string {
	const originUrlAnchor = document.querySelector(selector);
	if (originUrlAnchor === null) {
		debugLog('Failed to resolve originUrl');
		return document.location.href;
	}

	return (
		originUrlAnchor.getAttribute('href')?.split('?')?.[0] ??
		document.location.href
	);
}

export function getInfoBoxText(
	mode: ControllerModeStr | undefined,
	song: Song | null,
) {
	if (!mode) {
		return t('pageActionLoading');
	}

	const trackInfo = `${song?.getArtist()} - ${song?.getTrack()}`;
	switch (mode) {
		case ControllerMode.Disallowed:
			return t('infoBoxStateDisallowed', trackInfo);
		case ControllerMode.Err:
			return t('infoBoxStateError');
		case ControllerMode.Unknown:
			return t('infoBoxStateUnknown');
		default:
			// re-use existing translation messages
			return t(`pageAction${mode}`, trackInfo);
	}
}

export interface ChannelInfo {
	id: string;
	label: string;
}
