'use strict';

/**
 * Module that contains some useful helper functions for background scripts.
 */

define(() => {
	const STR_REPLACER = '*';
	const HIDDEN_PLACEHOLDER = '[hidden]';

	/**
	 * Number of seconds of playback before the track is scrobbled.
	 * This value is used only if no duration was parsed or loaded.
	 */
	const DEFAULT_SCROBBLE_TIME = 30;

	/**
	 * Minimum number of seconds of scrobbleable track.
	 */
	const MIN_TRACK_DURATION = 30;

	/**
	 * Max number of seconds of playback before the track is scrobbled.
	 */
	const MAX_SCROBBLE_TIME = 240;

	/**
	 * Print debug message.
	 * @param  {String} text Debug message
	 * @param  {String} [logType=log] Log type
	 */
	function debugLog(text, logType = 'log') {
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
	 * @param  {Number} duration Song duration
	 * @param  {Number} percent Percent of song duration to scrobble
	 * @return {Number} Seconds to scrobble
	 */
	function getSecondsToScrobble(duration, percent) {
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
	 * @param  {String} str String to be hidden
	 * @param  {String} text Text
	 * @return {String} Modified text
	 */
	function hideStringInText(str, text) {
		if (str && text) {
			const replacer = STR_REPLACER.repeat(str.length);
			return text.replace(str, replacer);
		}
		return text;
	}

	/**
	 * Get hidden string representation of given object.
	 * @param  {String} keyValue Value to be hidden
	 * @return {String} Modified string
	 */
	function hideObjectValue(keyValue) {
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
	 * Check if duration is not a valid number.
	 * @param  {Object}  duration Duration in seconds
	 * @return {Boolean} Check result
	 */
	function isDurationInvalid(duration) {
		return !duration || typeof duration !== 'number' ||
			isNaN(duration) || !isFinite(duration);
	}

	/**
	 * Execute promise with specified timeout.
	 * @param  {Number} timeout Timeout in milliseconds
	 * @param  {Promise} promise Promise to execute
	 * @return {Promise} Promise that will be resolved when the task has complete
	 */
	function timeoutPromise(timeout, promise) {
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
	 * Check if an array of ApiCallResult contains at least one result
	 * with a given result type.
	 *
	 * @param  {Array} results Array of ApiCallResult objects
	 * @param  {String} resultType ApiCallResult result type to check
	 * @return {Boolean} True if one or more results matching the given result type is found
	 */
	function isAnyResult(results, resultType) {
		return results.some((r) => r.is(resultType));
	}

	/**
	 * Check if an array of ApiCallResult contains all results with a
	 * given result type.
	 *
	 * @param  {Array} results Array of ApiCallResult objects
	 * @param  {String} resultType ApiCallResult result type to check
	 * @return {Boolean} True if all results matching the given result type
	 */
	function areAllResults(results, resultType) {
		return results.length > 0 && results.every((r) => r.is(resultType));
	}

	return {
		debugLog,
		isAnyResult,
		areAllResults,
		getSecondsToScrobble,
		hideObjectValue,
		hideStringInText,
		timeoutPromise,

		DEFAULT_SCROBBLE_TIME,
		HIDDEN_PLACEHOLDER,
		MAX_SCROBBLE_TIME,
		MIN_TRACK_DURATION,
	};
});
