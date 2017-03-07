'use strict';

/**
 * Module that contains some useful helper functions.
 */

const Util = {
	/**
	 * Extract artist and track from Youtube video title.
	 * @param  {String} videoTitle Youtube video title
	 * @param  {Array} separators Array of separators
	 * @return {Object} Object contains artist and track fields
	 */
	processYoutubeVideoTitle(videoTitle) {
		if (!videoTitle) {
			return { artist: null, track: null };
		}

		// Remove [genre] from the beginning of the title
		let title = videoTitle.replace(/^\[[^\]]+\]\s*-*\s*/i, '');

		let { artist, track } = this.splitArtistTrack(title);
		if (artist === null && track === null) {
			// Look for Artist "Track"
			let artistTrack = title.match(/(.+?)\s"(.+?)"/);
			if (artistTrack) {
				artist = artistTrack[1];
				track = artistTrack[2];
			}
		}
		return { artist, track };
	},

	/**
	 * Convert given time-string into seconds.
	 * @param  {String} str Time-string in h:m:s format
	 * @return {Number} Seconds
	 */
	stringToSeconds(str) {
		let s = str.toString().trim();
		let val, seconds = 0;

		for (let i = 0; i < 3; i++) {
			let idx = s.lastIndexOf(':');
			if (idx > -1) {
				val = parseInt(s.substr(idx + 1));
				seconds += val * Math.pow(60, i);
				s = s.substr(0, idx);
			} else {
				val = parseInt(s);
				seconds += val * Math.pow(60, i);
				break;
			}
		}

		return seconds || 0;
	},

	/**
	 * Find first occurence of possible separator in given string
	 * and return separator's position and size in chars or null.
	 * @param  {String} str String contains separator
	 * @param  {Array} separators Array of separators
	 * @return {Object} Object contains position and width of separator
	 */
	findSeparator(str, separators = null) {
		if (str === null || str.length === 0) {
			return null;
		}

		if (!separators) {
			separators = this.separators;
		}

		for (let sep of separators) {
			let index = str.indexOf(sep);
			if (index > -1) {
				return { index, length: sep.length };
			}
		}

		return null;
	},

	/**
	 * Split string to artist and track.
	 * @param  {String} str String contains artist and track
	 * @param  {Array} separators Array of separators
	 * @return {Object} Object contains artist and track fields
	 */
	splitArtistTrack(str, separators = null) {
		let artist = null;
		let track = null;

		if (str !== null) {
			let separator = this.findSeparator(str, separators);

			if (separator !== null) {
				artist = str.substr(0, separator.index);
				track = str.substr(separator.index + separator.length);
			}
		}

		return { artist, track };
	},

	/**
	 * Split string to current time and duration.
	 * @param  {String} str String contains current time and duration
	 * @param  {String} separator Separator
	 * @param  {Boolean} swap Swap currentTime and duration values
	 * @return {Object} Object contains 'currentTime' and 'duration' fields
	 */
	splitTimeInfo(str, sep = '/', swap = false) {
		let currentTime = null;
		let duration = null;

		if (str !== null) {
			let separator = this.findSeparator(str, [sep]);

			if (separator !== null) {
				currentTime = str.substr(0, separator.index);
				duration = str.substr(separator.index + separator.length);

				currentTime = this.stringToSeconds(currentTime);
				duration = this.stringToSeconds(duration);

				if (swap) {
					[currentTime, duration] = [duration, currentTime];
				}
			}
		}

		return { currentTime, duration };
	},

	/**
	 * Verify time value and return time as a Number object.
	 * @param  {Any} time Time value
	 * @return {Number} time value as a Number object
	 */
	escapeBadTimeValues(time) {
		if (typeof time !== 'number') {
			return null;
		}
		if (isNaN(time) || !isFinite(time)) {
			return null;
		}
		return Math.round(time);
	},

	/**
	 * Extract track art URL from CSS property.
	 * @param  {String} style CSS property
	 * @return {String} Track art URL
	 */
	extractUrlFromCssProperty(cssProperty) {
		let match = /url\((['"]?)(.*)\1\)/.exec(cssProperty);
		if (match) {
			return match[2].trim();
		}
		return null;
	},

	/**
	 * Default array of separators.
	 * Push new separators in the implementation if required.
	 *
	 * @type {Array}
	 */
	separators: [
		' -- ', '--', ' - ', ' – ', ' — ',
		' // ', '-', '–', '—', ':', '|', '///'
	]
};

/**
 * Export Util object if script is executed in Node.js context.
 */
if (typeof module !== 'undefined') {
	module.exports = Util;
}
