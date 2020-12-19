import {
	ApiCallResult,
	ApiCallResultType,
} from '@/background/scrobbler/api-call-result';
import { ParsedSongInfo } from '@/background/object/song';

export type LogType = 'log' | 'warn' | 'error';

const STR_REPLACER = '*';

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

/**
 * Check if an array of ApiCallResult contains all results with a
 * given result type.
 *
 * @param results Array of ApiCallResult objects
 * @param resultType ApiCallResult result type to check
 *
 * @return True if all results matching the given result type
 */
export function areAllResults(
	results: ApiCallResult[],
	resultType: ApiCallResultType
): boolean {
	return results.length > 0 && results.every((r) => r.is(resultType));
}

/* istanbul ignore next */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function assertUnreachable(x: never): never {
	throw new Error("Didn't expect to get here");
}

/**
 * Print debug message.gst
 *
 * @param message Debug message
 * @param [logType=log] Log type
 */
/* istanbul ignore next */
export function debugLog(message: string, logType: LogType = 'log'): void {
	console[logType](message);
}

/**
 * Return a total number of seconds of playback needed for a song to be
 * scrobbled. If the duration is not defined, return the default value.
 *
 * @param duration Song duration
 * @param percent Percent of song duration to scrobble
 *
 * @return Seconds to scrobble
 */
export function getSecondsToScrobble(
	duration: number,
	percent: number
): number {
	if (!duration) {
		return DEFAULT_SCROBBLE_TIME;
	}

	assertNumericValueIsValid(duration, 'Invalid duration value');
	assertNumericValueIsValid(percent, 'Invalid percent value');

	if (percent < 1 || percent > 100) {
		throw new TypeError('Percent value should be between 0 and 100');
	}

	if (duration < MIN_TRACK_DURATION) {
		return -1;
	}

	const scrobbleTime = Math.round((duration * percent) / 100);
	return Math.min(scrobbleTime, MAX_SCROBBLE_TIME);
}

/**
 * Hide a string in given text.
 *
 * @param str String to be hidden
 * @param text Text
 *
 * @return Modified text
 */
export function hideStringInText(str: string, text: string): string {
	if (str && text) {
		const replacer = STR_REPLACER.repeat(str.length);
		return text.replace(str, replacer);
	}
	return text;
}

/**
 * Get a hidden string representation of given object.
 *
 * @param value Value to be hidden
 *
 * @return String representation of the object
 */
export function hideObjectValue(value: unknown): string {
	if (value === null) {
		return 'null';
	}

	if (value === undefined) {
		return 'undefined';
	}

	if (typeof value === 'string') {
		return STR_REPLACER.repeat(value.length);
	}

	if (Array.isArray(value)) {
		return `[Array(${value.length})]`;
	}

	return `[Object(${Object.keys(value).length})]`;
}

/**
 * Check if an array of ApiCallResult contains at least one result
 * with a given result type.
 *
 * @param results Array of ApiCallResult objects
 * @param resultType ApiCallResult result type to check
 *
 * @return True if one or more results matching the given result type is found
 */
export function isAnyResult(
	results: ApiCallResult[],
	resultType: ApiCallResultType
): boolean {
	return results.some((r) => r.is(resultType));
}

/**
 * Check if a given connector state is empty.
 *
 * @param state Connector state
 *
 * @return Check result
 */
export function isStateEmpty(state: ParsedSongInfo): boolean {
	return !((state.artist && state.track) || state.uniqueID || state.duration);
}

/**
 * Execute promise with specified timeout.
 *
 * @param timeout Timeout in milliseconds
 * @param promise Promise to execute
 *
 * @return Promise that will be resolved when the task has complete
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
 * Check if a given numeric value is a number and is finite.
 *
 * @param n Number value to check
 * @param message Assert message
 */
function assertNumericValueIsValid(n: number, message: string) {
	if (Number.isFinite(n)) {
		return;
	}

	throw new TypeError(`${message}: ${n}`);
}
