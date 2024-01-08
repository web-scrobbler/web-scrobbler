import {
	ConnectorOptions,
	ConnectorsOverrideOptions,
	ConnectorsOverrideOptionValues,
	GlobalOptions,
	SavedEdit,
} from '@/core/storage/options';
import {
	ListenBrainzModel,
	WebhookModel,
	Properties,
	StateManagement,
	Blocklists,
} from '@/core/storage/wrapper';
import { RegexEdit } from './regex';

/**
 * Module that contains some useful helper functions for background scripts.
 */

const STR_REPLACER = '*';
export const HIDDEN_PLACEHOLDER = '[hidden]';

/**
 * Number of seconds of playback before the track is scrobbled.
 * This value is used only if no duration was parsed or loaded.
 */
export const DEFAULT_SCROBBLE_TIME = 30;

/**
 * Percentage of track to playback before the track is scrobbled.
 * This value is used only if scrobble percent storage is somehow corrupted.
 */
export const DEFAULT_SCROBBLE_PERCENT = 50;

/**
 * Minimum number of seconds of scrobbleable track.
 */
export const MIN_TRACK_DURATION = 30;

/**
 * Max number of seconds of playback before the track is scrobbled.
 */
export const MAX_SCROBBLE_TIME = 240;

export type DebugLogType = 'log' | 'error' | 'warn' | 'info';

/**
 * Print debug message.
 * @param text - Debug message
 * @param logType - Log type
 */
export function debugLog(text: unknown, logType: DebugLogType = 'log'): void {
	const logFunc = console[logType];

	if (typeof logFunc !== 'function') {
		throw new TypeError(`Unknown log type: ${logType}`);
	}

	/* istanbul ignore next */
	logFunc(text);
}

/**
 * Narrow the typing of scrobble percent.
 * Fallback to default if scrobble percent is not a number.
 *
 * @param percent - Scrobble percent value from settings
 * @returns percentage of track to play before scrobbling
 */
export function parseScrobblePercent(percent: unknown): number {
	return percent &&
		typeof percent === 'number' &&
		!isNaN(percent) &&
		isFinite(percent)
		? percent
		: DEFAULT_SCROBBLE_PERCENT;
}

/**
 * Return total number of seconds of playback needed for this track
 * to be scrobbled.
 * @param duration - Song duration
 * @param percent - Percent of song duration to scrobble
 * @returns Seconds to scrobble
 */
export function getSecondsToScrobble(
	duration: number | null | undefined,
	percent: number,
): number {
	if (isDurationInvalid(duration)) {
		return DEFAULT_SCROBBLE_TIME;
	}

	if (duration < MIN_TRACK_DURATION) {
		return -1;
	}

	const scrobbleTime = Math.round((duration * percent) / 100);
	return Math.min(scrobbleTime, MAX_SCROBBLE_TIME);
}

/**
 * Partial hide string in given text.
 * @param str - String to be hidden
 * @param text - Text
 * @returns Modified text
 */
export function hideStringInText(str: string, text: string): string {
	if (str && text) {
		const replacer = STR_REPLACER.repeat(str.length);
		return text.replace(str, replacer);
	}
	return text;
}

/**
 * Get hidden string representation of given object.
 * @param keyValue - Value to be hidden
 * @returns Modified string
 */
export function hideObjectValue(
	keyValue:
		| undefined
		| string
		| string[]
		| GlobalOptions
		| SavedEdit
		| ConnectorOptions
		| ConnectorsOverrideOptionValues
		| { authDisplayCount: number }
		| ConnectorsOverrideOptions
		| { appVersion: string }
		| { [key: string]: SavedEdit }
		| { sessionID?: string; sessionName?: string }
		| { token?: string }
		| Properties
		| ListenBrainzModel
		| WebhookModel
		| StateManagement
		| RegexEdit[]
		| Blocklists,
): string {
	if (!keyValue) {
		if (keyValue === null) {
			return 'null';
		}
		return keyValue?.toString() ?? 'undefined';
	}

	if (typeof keyValue === 'string') {
		return STR_REPLACER.repeat(keyValue.length);
	} else if (Array.isArray(keyValue)) {
		return `[Array(${keyValue.length})]`;
	}

	return HIDDEN_PLACEHOLDER;
}

/**
 * Check if duration is not a valid number.
 * @param duration - Duration in seconds
 * @returns Check result
 */
function isDurationInvalid(
	duration: number | null | undefined,
): duration is null | undefined {
	return (
		!duration ||
		typeof duration !== 'number' ||
		isNaN(duration) ||
		!isFinite(duration)
	);
}

/**
 * Execute promise with specified timeout.
 * @param timeout - Timeout in milliseconds
 * @param promise - Promise to execute
 * @returns Promise that will be resolved when the task has complete
 */
export function timeoutPromise<T>(
	timeout: number,
	promise: Promise<T>,
): Promise<T> {
	return new Promise((resolve, reject) => {
		const timeoutId = setTimeout(() => {
			reject(new Error('promise timeout'));
		}, timeout);
		promise.then(
			(res) => {
				clearTimeout(timeoutId);
				resolve(res);
			},
			(err) => {
				clearTimeout(timeoutId);
				reject(err);
			},
		);
	});
}

/**
 * Check if an array of scrobbler results contains at least one result
 * with a given result type.
 *
 * @param results - Array of scrobbler results
 * @param result - Scrobbler result to check
 * @returns True if one or more results matching the given result type is found
 */
export function isAnyResult<T>(results: T[], result: T): boolean {
	return results.some((r) => r === result);
}

/**
 * Check if an array of scrobbler results contains all results with a
 * given result type.
 *
 * @param results - Array of scrobbler results
 * @param result - Scrobbler result to check
 * @returns True if all results matching the given result type
 */
export function areAllResults<T>(results: T[], result: T): boolean {
	return results.length > 0 && results.every((r) => r === result);
}

/**
 * Capitalize the first letter in a string.
 *
 * @param text - The string to capitalize the first letter of
 * @returns The string with the first letter capitalized
 */
export function capitalizeFirstLetter(text: string): string {
	return text[0].toUpperCase() + text.slice(1);
}

/**
 * Create a URL to an artist page on Last.fm.
 * @param artist - Artist name
 * @returns URL to the artist page
 */
export function createArtistURL(artist: string | null | undefined): string {
	if (!artist) {
		return '';
	}
	return `https://www.last.fm/music/${encodeURIComponent(artist)}`;
}

/**
 * Create a URL to an album page on Last.fm.
 * @param artist - Artist name
 * @param album - Album name
 * @returns URL to the album page
 */
export function createAlbumURL(
	artist: string | null | undefined,
	album: string | null | undefined,
): string {
	if (!album || !artist) {
		return '';
	}
	return `${createArtistURL(artist)}/${encodeURIComponent(album)}`;
}

/**
 * Create a URL to a track page on Last.fm.
 * @param artist - Artist name
 * @param track - Track name
 * @returns URL to the track page
 */
export function createTrackURL(
	artist: string | null | undefined,
	track?: string | null | undefined,
): string {
	if (!track || !artist) {
		return '';
	}
	return `${createArtistURL(artist)}/_/${encodeURIComponent(track)}`;
}

/**
 * Create a URL to the page for a track in a user's library on Last.fm.
 * @param username - Username
 * @param artist - Artist name
 * @param track - Track name
 * @returns URL to the track library page
 */
export function createTrackLibraryURL(
	username: string | null | undefined,
	artist: string | null | undefined,
	track: string | null | undefined,
): string {
	if (!track || !artist || !username) {
		return '';
	}
	return `https://www.last.fm/user/${encodeURIComponent(
		username,
	)}/library/music/${encodeURIComponent(artist)}/_/${encodeURIComponent(
		track,
	)}`;
}

/**
 * Check if script is currently running in a background script.
 *
 * @returns true if running in background script, false if running in any other context including popup.
 */
export function isBackgroundScript(): boolean {
	// on chromium, no window in background script.
	if (!self.window) {
		return true;
	}
	// on firefox and safari, check for being in the generated background script
	if (
		(location.href.startsWith('safari-web-extension') ||
			location.href.startsWith('moz-extension')) &&
		location.href.endsWith('generated_background_page.html')
	) {
		return true;
	}
	return false;
}

/**
 * Attempt to fetch listenbrainz profile HTML.
 *
 * @param url - URL of listenbrainz instance
 * @returns html of profile, null if response error
 */
export async function fetchListenBrainzProfile(url: string) {
	const res = await fetch(url, {
		method: 'GET',
		// #v-ifdef VITE_FIREFOX
		credentials: 'same-origin',
		// #v-endif
	});
	if (!res.ok) {
		return null;
	}
	return res.text();
}

/**
 * Clamp value between a minimum and a maximum
 *
 * @param min - minimum value
 * @param value - value to clamp
 * @param max - maximum value
 */
export function clamp(min: number, value: number, max: number) {
	return Math.min(max, Math.max(min, value));
}
