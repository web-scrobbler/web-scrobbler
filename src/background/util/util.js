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

/**
 * Check if an array of ApiCallResult contains all results with a
 * given result type.
 *
 * @param {Array} results Array of ApiCallResult objects
 * @param {String} resultType ApiCallResult result type to check
 *
 * @return {Boolean} True if all results matching the given result type
 */
export function areAllResults(results, resultType) {
	return results.length > 0 && results.every((r) => r.is(resultType));
}

/**
 * Print debug message.
 *
 * @param {String} text Debug message
 * @param {String} [logType=log] Log type
 */
/* istanbul ignore next */
export function debugLog(text, logType = 'log') {
	const logFunc = console[logType];

	if (typeof logFunc !== 'function') {
		throw new TypeError(`Unknown log type: ${logType}`);
	}

	logFunc(text);
}

/**
 * Return total number of seconds of playback needed for this track
 * to be scrobbled.
 *
 * @param {Number} duration Song duration
 * @param {Number} percent Percent of song duration to scrobble
 *
 * @return {Number} Seconds to scrobble
 */
export function getSecondsToScrobble(duration, percent) {
	if (isDurationInvalid(duration)) {
		return DEFAULT_SCROBBLE_TIME;
	}

	if (duration < MIN_TRACK_DURATION) {
		return -1;
	}

	const scrobbleTime = Math.round(duration * percent / 100);
	return Math.min(scrobbleTime, MAX_SCROBBLE_TIME);
}

/**
 * Partial hide string in given text.
 *
 * @param {String} str String to be hidden
 * @param {String} text Text
 *
 * @return {String} Modified text
 */
export function hideStringInText(str, text) {
	if (str && text) {
		const replacer = STR_REPLACER.repeat(str.length);
		return text.replace(str, replacer);
	}
	return text;
}

/**
 * Get hidden string representation of given object.
 *
 * @param {String} keyValue Value to be hidden
 *
 * @return {String} Modified string
 */
export function hideObjectValue(keyValue) {
	if (!keyValue) {
		return keyValue;
	}

	if (typeof keyValue === 'string') {
		return STR_REPLACER.repeat(keyValue.length);
	} else if (Array.isArray(keyValue)) {
		return `[Array(${keyValue.length})]`;
	}

	return HIDDEN_PLACEHOLDER;
}

/**
 * Check if an array of ApiCallResult contains at least one result
 * with a given result type.
 *
 * @param {Array} results Array of ApiCallResult objects
 * @param {String} resultType ApiCallResult result type to check
 *
 * @return {Boolean} True if one or more results matching the given result type is found
 */
export function isAnyResult(results, resultType) {
	return results.some((r) => r.is(resultType));
}

/**
 * Execute promise with specified timeout.
 *
 * @param {Number} timeout Timeout in milliseconds
 * @param {Promise} promise Promise to execute
 *
 * @return {Promise} Promise that will be resolved when the task has complete
 */
export function timeoutPromise(timeout, promise) {
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
 * Check if duration is not a valid number.
 *
 * @param {Object}  duration Duration in seconds
 *
 * @return {Boolean} Check result
 */
function isDurationInvalid(duration) {
	return (
		!duration ||
		typeof duration !== 'number' ||
		isNaN(duration) ||
		!isFinite(duration)
	);
}
