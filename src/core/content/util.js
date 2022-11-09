'use strict';

/**
 * Module that contains some useful helper functions.
 */

const Util = {
	/**
	 * Separator used to join array of artist names into a single string.
	 * @type {String}
	 */
	ARTIST_SEPARATOR: ', ',

	/**
	 * Default array of separators used to split artist and track info.
	 * Push new separators in the implementation if required.
	 *
	 * @type {Array}
	 */
	separators: [
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
	],

	/**
	 * Convert given time-string into seconds.
	 * @param  {String} str Time-string in h:m:s format
	 * @return {Number} Seconds
	 */
	stringToSeconds(str) {
		const timeFormatExpression = /^\s*-?((\d{1,2}:\d\d:\d\d)|(\d{1,2}:\d\d)|(\d{1,2}))\s*$/g;
		if (!timeFormatExpression.test(str)) {
			return 0;
		}

		const negativeExpression = /-/g;
		const digitsExpression = /\d{1,2}/g;

		const seconds = str
			.match(digitsExpression)
			.reverse()
			.map((current) => parseInt(current, 10))
			.reduce((total, current, i) => total + current * Math.pow(60, i));

		return negativeExpression.test(str) ? -seconds : seconds;
	},

	/**
	 * Find first occurence of possible separator in given string
	 * and return separator's position and size in chars or null.
	 * @param  {String} str String contains separator
	 * @param  {Array} [separators] Array of separators
	 * @return {Object} Object contains position and width of separator
	 */
	findSeparator(str, separators = null) {
		if (str === null || str.length === 0) {
			return null;
		}

		for (const sep of separators || this.separators) {
			const index = str.indexOf(sep);
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
		if (!artists || artists.length === 0) {
			return null;
		}

		return artists
			.map((artist) => {
				return artist.textContent;
			})
			.join(this.ARTIST_SEPARATOR);
	},

	/**
	 * Split string to artist and track.
	 * @param  {String} str String contains artist and track
	 * @param  {Array} [separators] Array of separators
	 * @param  {Boolean} [swap=false] Swap artist and track values
	 * @return {Object} Object contains artist and track fields
	 */
	splitArtistTrack(str, separators = null, { swap = false } = {}) {
		const [artist, track] = this.splitString(str, separators, { swap });
		return { artist, track };
	},

	/**
	 * Regular Expression to detect record side in track title
	 * @type { RegExp }
	 */
	RECORD_SIDE_REGEX: /^[A-Z][1-9]\.? /,

	/**
	 * Remove record side from track title.
	 * @param {String} str String contains track title
	 * @return {String} String contains track title without record side
	 */
	removeRecordSide(str) {
		if (str !== null) {
			return str.replace(Util.RECORD_SIDE_REGEX, '');
		}
		return null;
	},

	/**
	 * Split string to artist and album.
	 * @param  {String} str String contains artist and track
	 * @param  {Array} [separators] Array of separators
	 * @param  {Boolean} [swap=false] Swap artist and track values
	 * @return {Object} Object contains artist and track fields
	 */
	splitArtistAlbum(str, separators = null, { swap = false } = {}) {
		const [artist, album] = this.splitString(str, separators, { swap });
		return { artist, album };
	},

	/**
	 * Split string to current time and duration.
	 * @param  {String} str String contains current time and duration
	 * @param  {String} [separator] Separator
	 * @param  {Boolean} [swap=false] Swap currentTime and duration values
	 * @return {Object} Array ontains 'currentTime' and 'duration' fields
	 */
	splitTimeInfo(str, separator = '/', { swap = false } = {}) {
		let [currentTime, duration] = this.splitString(str, [separator], {
			swap,
		});
		if (currentTime) {
			currentTime = this.stringToSeconds(currentTime);
		}
		if (duration) {
			duration = this.stringToSeconds(duration);
		}

		return { currentTime, duration };
	},

	/**
	 * Split string to two ones using array of separators.
	 * @param  {String} str Any string
	 * @param  {Array} [separators] Array of separators
	 * @param  {Boolean} [swap=false] Swap values
	 * @return {Array} Array of strings splitted by separator
	 */
	splitString(str, separators, { swap = false } = {}) {
		let first = null;
		let second = null;

		if (str) {
			const separator = this.findSeparator(str, separators);

			if (separator !== null) {
				first = str.substr(0, separator.index);
				second = str.substr(separator.index + separator.length);

				if (swap) {
					[second, first] = [first, second];
				}
			}
		}

		return [first, second];
	},

	/**
	 * Verify time value and return time as a Number object.
	 * Return null value if time value is not a number.
	 * @param  {Object} time Time value
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
	 * @param  {String} cssProperty CSS property
	 * @return {String} Track art URL
	 */
	extractUrlFromCssProperty(cssProperty) {
		const match = /url\((["']?)(.*)\1\)/.exec(cssProperty);
		if (match) {
			return match[2].trim();
		}
		return null;
	},

	/**
	 * Returns a function, that, when invoked, will only be triggered
	 * at most once during a given window of time.
	 *
	 * Taken from Underscore library.
	 *
	 * @param  {Function} func Function to be throttled
	 * @param  {Number} wait Time before function calls
	 * @param  {Object} [options] Throttle options
	 * @param  {Boolean} [options.leading] Enable leading-edge call
	 * @param  {Boolean} [options.trailing] Enable trailing-edge call
	 * @return {Function} Throttled function
	 */
	/* istanbul ignore next */
	throttle(func, wait, options = {}) {
		let context;
		let args;
		let result;
		let timeout = null;
		let previous = 0;

		function later() {
			previous = options.leading === false ? 0 : Date.now();
			timeout = null;
			result = func.apply(context, args);
			if (!timeout) {
				context = args = null;
			}
		}
		return function() {
			const now = Date.now();
			if (!previous && options.leading === false) {
				previous = now;
			}
			const remaining = wait - (now - previous);
			context = this;
			args = arguments;
			if (remaining <= 0 || remaining > wait) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				previous = now;
				result = func.apply(context, args);
				if (!timeout) {
					context = args = null;
				}
			} else if (!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		};
	},

	/**
	 * Check if given 'artistTrack' object is empty. The object means empty
	 * if its 'artist' and 'track' properties are undefined, null or empty.
	 * @param  {Object}  artistTrack Object contains artist and track info
	 * @return {Boolean} True if object is empty; false otherwise
	 */
	isArtistTrackEmpty(artistTrack) {
		return !(artistTrack && artistTrack.artist && artistTrack.track);
	},

	/**
	 * Fill fields of a target object with non-empty field values
	 * of a source object.
	 *
	 * @param  {Object} target Target object
	 * @param  {Object} source Source object
	 * @param  {Array} fields List of fields to fill
	 */
	fillEmptyFields(target, source, fields) {
		if (!(source && Array.isArray(fields))) {
			return target;
		}

		for (const field of fields) {
			if (!target[field] && source[field]) {
				target[field] = source[field];
			}
		}

		return target;
	},

	/**
	 * Get track info from MediaSession object.
	 *
	 * @param  {Object} mediaSession MediaSession instance
	 * @return {Object} Object contains track info
	 */
	getMediaSessionInfo(mediaSession) {
		if (!(mediaSession && mediaSession.metadata)) {
			return null;
		}

		const { artist, album, title, artwork } = mediaSession.metadata;

		const track = title;
		let trackArt = null;
		if (Array.isArray(artwork) && artwork.length > 0) {
			const { src } = artwork[artwork.length - 1];
			trackArt = src;
		}

		return { artist, track, album, trackArt };
	},

	/** Browser-related helper functions. */

	/**
	 * Return text of first available element. If `selectors` is a string,
	 * return text of element with given selector. If `selectors` is
	 * an array, return text of first available element.
	 * @param  {String|Array} selectors Single selector or array of selectors
	 * @param  {Object} [defaultValue=null] Fallback value
	 * @return {Object} Text of element, if available, or default value
	 */
	/* istanbul ignore next */
	getTextFromSelectors(selectors, defaultValue = null) {
		const elements = this.queryElements(selectors);

		if (elements) {
			if (elements.length === 1) {
				return elements.text();
			}

			for (const element of elements) {
				const text = $(element).text();
				if (text) {
					return text;
				}
			}
		}

		return defaultValue;
	},

	/**
	 * Return a text value of a first available element. If `selectors` is
	 * a string, return the attribute value of an element matching by
	 * the selector. If `selectors` is an array, return the attribute value of
	 * a first element with the attribute available.
	 *
	 * @param  {String|Array} selectors Single selector or array of selectors
	 * @param  {String} attr Attrubute to get
	 * @param  {Object} [defaultValue=null] Fallback value
	 * @return {Object} Text of element, if available, or default value
	 */
	/* istanbul ignore next */
	getAttrFromSelectors(selectors, attr, defaultValue = null) {
		const elements = this.queryElements(selectors);

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
	},

	/**
	 * Extract time in seconds from first available element
	 * defined by CSS selector.
	 *
	 * @param  {String|Array} selectors Single selector or array of selectors
	 * @return {String} Track art URL
	 */
	/* istanbul ignore next */
	getSecondsFromSelectors(selectors) {
		return Util.stringToSeconds(Util.getTextFromSelectors(selectors));
	},

	/**
	 * Extract image URL from first available element defined by CSS selector.
	 * @param  {String|Array} selectors Single selector or array of selectors
	 * @return {String} Track art URL
	 */
	/* istanbul ignore next */
	extractImageUrlFromSelectors(selectors) {
		const element = Util.queryElements(selectors);
		if (!element) {
			return null;
		}

		let trackArtUrl = element.attr('src');
		if (!trackArtUrl) {
			const cssProperties = ['background-image', 'background'];
			for (const property of cssProperties) {
				const propertyValue = element.css(property);
				if (propertyValue) {
					trackArtUrl = this.extractUrlFromCssProperty(propertyValue);
				}
			}
		}

		return this.normalizeUrl(trackArtUrl);
	},

	/**
	 * Check if an element matching a given selector has a class.
	 *
	 * @param  {String|Array} selectors Single selector or array of selectors
	 * @param  {String} cls Class name to check
	 * @return {Boolean} Check result
	 */
	/* istanbul ignore next */
	hasElementClass(selectors, cls) {
		const element = Util.queryElements(selectors);
		return element && element.hasClass(cls);
	},

	/**
	 * Check if an element matching a given selector is visible.
	 *
	 * @param  {String|Array} selectors Single selector or array of selectors
	 * @return {Boolean} Check result
	 */
	/* istanbul ignore next */
	isElementVisible(selectors) {
		const element = this.queryElements(selectors);
		return element && element.is(':visible');
	},

	/**
	 * Return jQuery object of first available element. If `selectors`
	 * is a string, return jQuery object with the selector. If `selectors` is
	 * an array, return jQuery object matched by first valid selector.
	 * @param  {String|Array} selectors Single selector or array of selectors
	 * @return {Object} jQuery object
	 */
	/* istanbul ignore next */
	queryElements(selectors) {
		if (!selectors) {
			return null;
		}

		if (typeof selectors === 'string') {
			return $(selectors);
		}

		if (!Array.isArray(selectors)) {
			throw new TypeError(
				`Unknown type of selector: ${typeof selectors}`
			);
		}

		for (const selector of selectors) {
			const element = $(selector);
			if (element.length > 0) {
				return element;
			}
		}

		return null;
	},

	/**
	 * Read connector option from storage.
	 * @param  {String} connector Connector name
	 * @param  {String} key Option key
	 * @return {Object} Option value
	 */
	/* istanbul ignore next */
	async getOption(connector, key) {
		const data = await browser.storage.sync.get('Connectors');
		return data.Connectors[connector][key];
	},

	/**
	 * Normalize given URL. Currently it only normalizes
	 * protocol-relative and root-relative links.
	 * @param  {String} url URL, which is possibly relative
	 * @return {String} Normalized URL
	 */
	/* istanbul ignore next */
	normalizeUrl(url) {
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
	},

	/**
	 * Inject script into document.
	 * @param {String} scriptUrl script URL
	 */
	/* istanbul ignore next */
	injectScriptIntoDocument(scriptUrl) {
		const script = document.createElement('script');
		script.src = scriptUrl;
		script.onload = function() {
			this.parentNode.removeChild(this);
		};
		(document.head || document.documentElement).appendChild(script);
	},

	/**
	 * Print debug message with prefixed "Web Scrobbler" string.
	 * @param  {String} text Debug message
	 * @param  {String} [logType=log] Log type
	 */
	/* istanbul ignore next */
	debugLog(text, logType = 'log') {
		const logFunc = console[logType];

		if (typeof logFunc !== 'function') {
			throw new TypeError(`Unknown log type: ${logType}`);
		}

		const message = `Web Scrobbler: ${text}`;
		logFunc(message);
	},

	/** YouTube section. */

	/**
	 * Regular expression used to get Youtube video ID from URL. It covers
	 * default, shortened and embed URLs.
	 * @type {RegExp}
	 */
	ytVideoIdRegExp: /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?.*v=))([^#&?]*).*/,

	ytDescFirstLine: 'Provided to YouTube',

	ytDescLastLine: 'Auto-generated by YouTube.',

	ytDescSeparator: ' · ',

	ytTitleRegExps: [
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
	],

	/**
	 * Extract artist and track from Youtube video title.
	 * @param  {String} videoTitle Youtube video title
	 * @return {Object} Object contains artist and track fields
	 */
	processYtVideoTitle(videoTitle) {
		let artist = null;
		let track = null;

		if (!videoTitle) {
			return { artist, track };
		}

		// Remove [genre] or 【genre】 from the beginning of the title
		let title = videoTitle.replace(
			/^((\[[^\]]+])|(【[^】]+】))\s*-*\s*/i,
			''
		);

		// Remove track (CD and vinyl) numbers from the beginning of the title
		title = title.replace(/^\s*([a-zA-Z]{1,2}|[0-9]{1,2})[1-9]?\.\s+/i, '');

		// Remove - preceding opening bracket
		title = title.replace(/-\s*([「【『])/, '$1');

		// 【/(*Music Video/MV/PV*】/)
		title = title.replace(/[(【].*?((MV)|(PV)).*?[】)]/i, '');

		// 【/(東方/オリジナル*】/)
		title = title.replace(/[(【]((オリジナル)|(東方)).*?[】)]/, '');

		// MV/PV if followed by an opening/closing bracket
		title = title.replace(/(MV|PV)([「【『』】」])/i, '$2');

		// MV/PV if ending and with whitespace in front
		title = title.replace(/\s+(MV|PV)$/i, '');

		// Try to match one of the regexps
		for (const regExp of this.ytTitleRegExps) {
			const artistTrack = title.match(regExp.pattern);
			if (artistTrack) {
				artist = artistTrack[regExp.groups.artist];
				track = artistTrack[regExp.groups.track];
				break;
			}
		}

		// No match? Try splitting, then.
		if (this.isArtistTrackEmpty({ artist, track })) {
			({ artist, track } = this.splitArtistTrack(title));
		}

		// No match? Check for 【】
		if (this.isArtistTrackEmpty({ artist, track })) {
			const artistTrack = title.match(/(.+?)【(.+?)】/);
			if (artistTrack) {
				artist = artistTrack[1];
				track = artistTrack[2];
			}
		}

		if (this.isArtistTrackEmpty({ artist, track })) {
			track = title;
		}

		return { artist, track };
	},

	isYtVideoDescriptionValid(desc) {
		return (
			desc &&
			(desc.startsWith(this.ytDescFirstLine) ||
				desc.endsWith(this.ytDescLastLine))
		);
	},

	parseYtVideoDescription(desc) {
		if (!this.isYtVideoDescriptionValid(desc)) {
			return null;
		}

		const lines = desc
			.split('\n')
			.filter((line) => {
				return line.length > 0;
			})
			.filter((line) => {
				return !line.startsWith(this.ytDescFirstLine);
			});

		const firstLine = lines[0];
		const secondLine = lines[1];

		const trackInfo = firstLine.split(this.ytDescSeparator);
		const numberOfFields = trackInfo.length;

		const album = secondLine;
		let artist = null;
		let track = null;
		let featArtists = null;

		if (numberOfFields < 2) {
			[track] = trackInfo;
		} else if (numberOfFields === 2) {
			[track, artist] = trackInfo;
		} else {
			[track, artist, ...featArtists] = trackInfo;

			const areFeatArtistPresent = featArtists.some((artist) =>
				track.includes(artist)
			);
			if (!areFeatArtistPresent) {
				const featArtistsStr = featArtists.join(this.ARTIST_SEPARATOR);
				track = `${track} (feat. ${featArtistsStr})`;
			}
		}

		return { artist, track, album };
	},

	/**
	 * Parse given video URL and return video ID.
	 * @param  {String} videoUrl Video URL
	 * @return {String} Video ID
	 */
	getYtVideoIdFromUrl(videoUrl) {
		if (!videoUrl) {
			return null;
		}

		const match = videoUrl.match(this.ytVideoIdRegExp);
		if (match) {
			return match[7];
		}

		return null;
	},

	/** SoundCloud section. */

	/**
	 * Regular expression used to split artist and track.
	 * @type {Object}
	 */
	scArtistTrackRe: /(.+)\s[:\u2013-\u2015-]\s(.+)/,

	/**
	 * Extract artist and track from SoundCloud track title.
	 * @param  {String} track SoundCloud track title
	 * @return {Object} Object contains artist and track fields
	 */
	processSoundCloudTrack(track) {
		/*
		 * Sometimes the artist name is in the track title,
		 * e.g. Tokyo Rose - Zender Overdrive by Aphasia Records.
		 */
		const match = this.scArtistTrackRe.exec(track);

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
	},

	/**
	 * Get the origin URL from selector, falling back to the document location on failure.
	 * @param {String} selector - A string containing one or more selectors to match. Must be a valid CSS selector string.
	 * @return {String} Returns the href attribute of the first matching element. Defaults to the current browser location.
	 */
	getOriginUrl(selector) {
		const originUrlAnchor = document.querySelector(selector);
		if (originUrlAnchor === null) {
			Util.debugLog('Failed to resolve originUrl');
			return document.location.href;
		}

		return originUrlAnchor.href.split('?')[0];
	},
};

// @ifdef DEBUG
/**
 * Export Util object if script is executed in Node.js context.
 */
/* istanbul ignore next */
if (typeof module !== 'undefined') {
	module.exports = Util;
}
// @endif
