import {
	ConnectorOptions,
	ConnectorsOverrideOptions,
	ConnectorsOverrideOptionValues,
	GlobalOptions,
	SavedEdit,
} from '@/core/storage/options';
import {
	ListenBrainzModel,
	Properties,
	StateManagement,
} from '@/core/storage/wrapper';

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
 * Return total number of seconds of playback needed for this track
 * to be scrobbled.
 * @param duration - Song duration
 * @param percent - Percent of song duration to scrobble
 * @returns Seconds to scrobble
 */
export function getSecondsToScrobble(
	duration: number,
	percent: number
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
		| StateManagement
): string {
	if (!keyValue) {
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
function isDurationInvalid(duration: number) {
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
	promise: Promise<T>
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
			}
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
