'use strict';

/**
 * Module that contains some useful helper functions.
 */

/**
 * Separator used to join array of artist names into a single string.
 * @type {String}
 */
const ARTIST_SEPARATOR = ', ';

const Util = {
	/**
	 * Extract artist and track from Youtube video title.
	 * @param  {String} videoTitle Youtube video title
	 * @param  {Array} separators Array of separators
	 * @return {Object} Object contains artist and track fields
	 */
	processYoutubeVideoTitle(videoTitle) {
		if (!videoTitle) {
			return this.emptyArtistTrack;
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
	 * Parse given video URL and return video ID.
	 * @param  {String} videoUrl Video URL
	 * @return {String} Video ID
	 */
	getYoutubeVideoIdFromUrl(videoUrl) {
		let regExp = /v=([^#\&\?]*)/;
		let match = videoUrl.match(regExp);
		if (match) {
			return match[1];
		}

		return null;
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
	 * Join array of artist name into a string. The array must contain objects
	 * that have 'textContent' property (DOM node).
	 * @param  {Array} artists Array of DOM nodes
	 * @return {String} String joined by separator
	 */
	joinArtists(artists) {
		return artists.map((artist) => {
			return artist.textContent;
		}).join(ARTIST_SEPARATOR);
	},

	/**
	 * Split string to artist and track.
	 * @param  {String} str String contains artist and track
	 * @param  {Array} separators Array of separators
	 * @return {Object} Object contains artist and track fields
	 */
	splitArtistTrack(str, separators = null) {
		let [artist, track] = this.splitString(str, separators);
		return { artist, track };
	},

	/**
	 * Split string to current time and duration.
	 * @param  {String} str String contains current time and duration
	 * @param  {String} separator Separator
	 * @param  {Boolean} swap Swap currentTime and duration values
	 * @return {Object} Array ontains 'currentTime' and 'duration' fields
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
	 * Split string to two ones using array of separators.
	 * @param  {String} str Any string
	 * @param  {Array} separators Array of separators
	 * @return {Array} Array of strings splitted by separator
	 */
	splitString(str, separators = null) {
		let first = null;
		let second = null;

		if (str !== null) {
			let separator = this.findSeparator(str, separators);

			if (separator !== null) {
				first = str.substr(0, separator.index);
				second = str.substr(separator.index + separator.length);
			}
		}

		return [first, second];
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
	 * Inject script into document.
	 * @param {String} scriptUrl script URL
	 */
	injectScriptIntoDocument(scriptUrl) {
		let script = document.createElement('script');
		script.src = scriptUrl;
		script.onload = function() {
			this.parentNode.removeChild(this);
		};
		(document.head || document.documentElement).appendChild(script);
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
	],

	/**
	 * Object that contains no artist and track info.
	 * @type {Object}
	 */
	emptyArtistTrack: { artist: null, track: null }
};

/**
 * Export Util object if script is executed in Node.js context.
 */
if (typeof module !== 'undefined') {
	module.exports = Util;
}
