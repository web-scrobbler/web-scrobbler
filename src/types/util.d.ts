declare namespace Util {
    export const ARTIST_SEPARATOR: string;
    export const separators: string[];
    /**
     * Convert given time-string into seconds.
     *
     * @param {String} str Time-string in h:m:s format
     *
     * @return {Number} Seconds
     */
    export function stringToSeconds(str: string): number;
    /**
     * Convert given time-string into seconds.
     *
     * @param {String} str Time-string in h:m:s format
     *
     * @return {Number} Seconds
     */
    export function stringToSeconds(str: string): number;
    /**
     * Find first occurence of possible separator in given string
     * and return separator's position and size in chars or null.
     *
     * @param {String} str String contains separator
     * @param {String[]} [separators] Array of separators
     *
     * @return {Object} Object contains position and width of separator
     */
    export function findSeparator(str: string, separators?: string[]): any;
    /**
     * Find first occurence of possible separator in given string
     * and return separator's position and size in chars or null.
     *
     * @param {String} str String contains separator
     * @param {String[]} [separators] Array of separators
     *
     * @return {Object} Object contains position and width of separator
     */
    export function findSeparator(str: string, separators?: string[]): any;
    /**
     * Join array of artist name into a string. The array must contain objects
     * that have 'textContent' property (DOM node).
     *
     * @param {NodeList} artists List of DOM nodes
     *
     * @return {String} String joined by separator
     */
    export function joinArtists(artists: NodeList): string;
    /**
     * Join array of artist name into a string. The array must contain objects
     * that have 'textContent' property (DOM node).
     *
     * @param {NodeList} artists List of DOM nodes
     *
     * @return {String} String joined by separator
     */
    export function joinArtists(artists: NodeList): string;
    /**
     * Split string to artist and track.
     *
     * @param {String} str String contains artist and track
     * @param {String[]} [separators] Array of separators
     * @param {Boolean} [swap=false] Swap artist and track values
     *
     * @return {Object} Object contains artist and track fields
     */
    export function splitArtistTrack(str: string, separators?: string[], { swap }?: boolean): any;
    /**
     * Split string to artist and track.
     *
     * @param {String} str String contains artist and track
     * @param {String[]} [separators] Array of separators
     * @param {Boolean} [swap=false] Swap artist and track values
     *
     * @return {Object} Object contains artist and track fields
     */
    export function splitArtistTrack(str: string, separators?: string[], { swap }?: boolean): any;
    /**
     * Split string to artist and album.
     *
     * @param {String} str String contains artist and track
     * @param {String[]} [separators] Array of separators
     * @param {Boolean} [swap=false] Swap artist and track values
     *
     * @return {Object} Object contains artist and track fields
     */
    export function splitArtistAlbum(str: string, separators?: string[], { swap }?: boolean): any;
    /**
     * Split string to artist and album.
     *
     * @param {String} str String contains artist and track
     * @param {String[]} [separators] Array of separators
     * @param {Boolean} [swap=false] Swap artist and track values
     *
     * @return {Object} Object contains artist and track fields
     */
    export function splitArtistAlbum(str: string, separators?: string[], { swap }?: boolean): any;
    /**
     * Split string to current time and duration.
     *
     * @param {String} str String contains current time and duration
     * @param {String} [separator] Separator
     * @param {Boolean} [swap=false] Swap currentTime and duration values
     *
     * @return {Object} Array ontains 'currentTime' and 'duration' fields
     */
    export function splitTimeInfo(str: string, separator?: string, { swap }?: boolean): any;
    /**
     * Split string to current time and duration.
     *
     * @param {String} str String contains current time and duration
     * @param {String} [separator] Separator
     * @param {Boolean} [swap=false] Swap currentTime and duration values
     *
     * @return {Object} Array ontains 'currentTime' and 'duration' fields
     */
    export function splitTimeInfo(str: string, separator?: string, { swap }?: boolean): any;
    /**
     * Split string to two ones using array of separators.
     *
     * @param {String} str Any string
     * @param {String[]} [separators] Array of separators
     * @param {Boolean} [swap=false] Swap values
     *
     * @return {String[]} Array of strings splitted by separator
     */
    export function splitString(str: string, separators?: string[], { swap }?: boolean): string[];
    /**
     * Split string to two ones using array of separators.
     *
     * @param {String} str Any string
     * @param {String[]} [separators] Array of separators
     * @param {Boolean} [swap=false] Swap values
     *
     * @return {String[]} Array of strings splitted by separator
     */
    export function splitString(str: string, separators?: string[], { swap }?: boolean): string[];
    /**
     * Verify time value and return time as a Number object.
     * Return null value if time value is not a number.
     *
     * @param {Object} time Time value
     *
     * @return {Number} time value as a Number object
     */
    export function escapeBadTimeValues(time: any): number;
    /**
     * Verify time value and return time as a Number object.
     * Return null value if time value is not a number.
     *
     * @param {Object} time Time value
     *
     * @return {Number} time value as a Number object
     */
    export function escapeBadTimeValues(time: any): number;
    /**
     * Extract track art URL from CSS property.
     *
     * @param {String} cssProperty CSS property
     *
     * @return {String} Track art URL
     */
    export function extractUrlFromCssProperty(cssProperty: string): string;
    /**
     * Extract track art URL from CSS property.
     *
     * @param {String} cssProperty CSS property
     *
     * @return {String} Track art URL
     */
    export function extractUrlFromCssProperty(cssProperty: string): string;
    /**
     * Returns a function, that, when invoked, will only be triggered
     * at most once during a given window of time.
     *
     * Taken from Underscore library.
     *
     * @param {Function} func Function to be throttled
     * @param {Number} wait Time before function calls
     * @param {Object} [options] Throttle options
     * @param {Boolean} [options.leading] Enable leading-edge call
     * @param {Boolean} [options.trailing] Enable trailing-edge call
     *
     * @return {Function} Throttled function
     */
    export function throttle(func: Function, wait: number, options?: {
        leading?: boolean;
        trailing?: boolean;
    }): Function;
    /**
     * Returns a function, that, when invoked, will only be triggered
     * at most once during a given window of time.
     *
     * Taken from Underscore library.
     *
     * @param {Function} func Function to be throttled
     * @param {Number} wait Time before function calls
     * @param {Object} [options] Throttle options
     * @param {Boolean} [options.leading] Enable leading-edge call
     * @param {Boolean} [options.trailing] Enable trailing-edge call
     *
     * @return {Function} Throttled function
     */
    export function throttle(func: Function, wait: number, options?: {
        leading?: boolean;
        trailing?: boolean;
    }): Function;
    /**
     * Check if given 'artistTrack' object is empty. The object means empty
     * if its 'artist' and 'track' properties are undefined, null or empty.
     *
     * @param {Object}  artistTrack Object contains artist and track info
     *
     * @return {Boolean} True if object is empty; false otherwise
     */
    export function isArtistTrackEmpty(artistTrack: any): boolean;
    /**
     * Check if given 'artistTrack' object is empty. The object means empty
     * if its 'artist' and 'track' properties are undefined, null or empty.
     *
     * @param {Object}  artistTrack Object contains artist and track info
     *
     * @return {Boolean} True if object is empty; false otherwise
     */
    export function isArtistTrackEmpty(artistTrack: any): boolean;
    /**
     * Fill fields of a target object with non-empty field values
     * of a source object.
     *
     * @param {Object} target Target object
     * @param {Object} source Source object
     *
     * @param {String[]} fields List of fields to fill
     */
    export function fillEmptyFields(target: any, source: any, fields: string[]): any;
    /**
     * Fill fields of a target object with non-empty field values
     * of a source object.
     *
     * @param {Object} target Target object
     * @param {Object} source Source object
     *
     * @param {String[]} fields List of fields to fill
     */
    export function fillEmptyFields(target: any, source: any, fields: string[]): any;
    /**
     * Get track info from MediaSession object.
     *
     * @param {Object} mediaSession MediaSession instance
     *
     * @return {Object} Object contains track info
     */
    export function getMediaSessionInfo(mediaSession: any): any;
    /**
     * Get track info from MediaSession object.
     *
     * @param {Object} mediaSession MediaSession instance
     *
     * @return {Object} Object contains track info
     */
    export function getMediaSessionInfo(mediaSession: any): any;
    /** Browser-related helper functions. */
    /**
     * Return text of first available element. If `selectors` is a string,
     * return text of element with given selector. If `selectors` is
     * an array, return text of first available element.
     *
     * @param {String|String[]} selectors Single selector or array of selectors
     * @param {String} [defaultValue=null] Fallback value
     *
     * @return {String} Text of element, if available, or default value
     */
    export function getTextFromSelectors(selectors: string | string[], defaultValue?: string): string;
    /** Browser-related helper functions. */
    /**
     * Return text of first available element. If `selectors` is a string,
     * return text of element with given selector. If `selectors` is
     * an array, return text of first available element.
     *
     * @param {String|String[]} selectors Single selector or array of selectors
     * @param {String} [defaultValue=null] Fallback value
     *
     * @return {String} Text of element, if available, or default value
     */
    export function getTextFromSelectors(selectors: string | string[], defaultValue?: string): string;
    /**
     * Return a text value of a first available element. If `selectors` is
     * a string, return the attribute value of an element matching by
     * the selector. If `selectors` is an array, return the attribute value of
     * a first element with the attribute available.
     *
     * @param {String|String[]} selectors Single selector or array of selectors
     * @param {String} attr Attrubute to get
     * @param {String} [defaultValue=null] Fallback value
     *
     * @return {String} Text of element, if available, or default value
     */
    export function getAttrFromSelectors(selectors: string | string[], attr: string, defaultValue?: string): string;
    /**
     * Return a text value of a first available element. If `selectors` is
     * a string, return the attribute value of an element matching by
     * the selector. If `selectors` is an array, return the attribute value of
     * a first element with the attribute available.
     *
     * @param {String|String[]} selectors Single selector or array of selectors
     * @param {String} attr Attrubute to get
     * @param {String} [defaultValue=null] Fallback value
     *
     * @return {String} Text of element, if available, or default value
     */
    export function getAttrFromSelectors(selectors: string | string[], attr: string, defaultValue?: string): string;
    /**
     * Extract time in seconds from first available element
     * defined by CSS selector.
     *
     * @param {String|String[]} selectors Single selector or array of selectors
     *
     * @return {String} Track art URL
     */
    export function getSecondsFromSelectors(selectors: string | string[]): string;
    /**
     * Extract time in seconds from first available element
     * defined by CSS selector.
     *
     * @param {String|String[]} selectors Single selector or array of selectors
     *
     * @return {String} Track art URL
     */
    export function getSecondsFromSelectors(selectors: string | string[]): string;
    /**
     * Extract image URL from first available element defined by CSS selector.
     *
     * @param {String|String[]} selectors Single selector or array of selectors
     *
     * @return {String} Track art URL
     */
    export function extractImageUrlFromSelectors(selectors: string | string[]): string;
    /**
     * Extract image URL from first available element defined by CSS selector.
     *
     * @param {String|String[]} selectors Single selector or array of selectors
     *
     * @return {String} Track art URL
     */
    export function extractImageUrlFromSelectors(selectors: string | string[]): string;
    /**
     * Check if an element matching a given selector has a class.
     *
     * @param {String|String[]} selectors Single selector or array of selectors
     * @param {String} cls Class name to check
     *
     * @return {Boolean} Check result
     */
    export function hasElementClass(selectors: string | string[], cls: string): boolean;
    /**
     * Check if an element matching a given selector has a class.
     *
     * @param {String|String[]} selectors Single selector or array of selectors
     * @param {String} cls Class name to check
     *
     * @return {Boolean} Check result
     */
    export function hasElementClass(selectors: string | string[], cls: string): boolean;
    /**
     * Check if an element matching a given selector is visible.
     *
     * @param {String|String[]} selectors Single selector or array of selectors
     *
     * @return {Boolean} Check result
     */
    export function isElementVisible(selectors: string | string[]): boolean;
    /**
     * Check if an element matching a given selector is visible.
     *
     * @param {String|String[]} selectors Single selector or array of selectors
     *
     * @return {Boolean} Check result
     */
    export function isElementVisible(selectors: string | string[]): boolean;
    /**
     * Return an array of elements matching by a given selectors. The `selectors`
     * argument can be either a string, or an array of strings. If an array of
     * strings is passed, the function will return an array of elements queried
     * using a first valid selector.
     *
     * @param {String|String[]} selectors Single selector or array of selectors
     *
     * @return {Element[]} Array of elements
     */
    export function queryElements(selectors: string | string[]): Element[];
    /**
     * Return an array of elements matching by a given selectors. The `selectors`
     * argument can be either a string, or an array of strings. If an array of
     * strings is passed, the function will return an array of elements queried
     * using a first valid selector.
     *
     * @param {String|String[]} selectors Single selector or array of selectors
     *
     * @return {Element[]} Array of elements
     */
    export function queryElements(selectors: string | string[]): Element[];
    /**
     * Return an element matching by a given selectors. The `selectors` argument
     * can be either a string, or an array of strings. If an array of strings
     * is passed, the function will return a nods queried using a first
     * valid selector.
     *
     * @param {String|String[]} selectors Single selector or array of selectors
     *
     * @return {Element} Element instance
     */
    export function queryElement(selectors: string | string[]): Element;
    /**
     * Return an element matching by a given selectors. The `selectors` argument
     * can be either a string, or an array of strings. If an array of strings
     * is passed, the function will return a nods queried using a first
     * valid selector.
     *
     * @param {String|String[]} selectors Single selector or array of selectors
     *
     * @return {Element} Element instance
     */
    export function queryElement(selectors: string | string[]): Element;
    /**
     * Read connector option from storage.
     *
     * @param {String} connector Connector name
     * @param {String} key Option key
     *
     * @return {Object} Option value
     */
    export function getOption(connector: string, key: string): any;
    /**
     * Read connector option from storage.
     *
     * @param {String} connector Connector name
     * @param {String} key Option key
     *
     * @return {Object} Option value
     */
    export function getOption(connector: string, key: string): any;
    /**
     * Normalize given URL. Currently it only normalizes
     * protocol-relative links.
     *
     * @param {String} url URL, which is possibly protocol-relative
     *
     * @return {String} Normalized URL
     */
    export function normalizeUrl(url: string): string;
    /**
     * Normalize given URL. Currently it only normalizes
     * protocol-relative links.
     *
     * @param {String} url URL, which is possibly protocol-relative
     *
     * @return {String} Normalized URL
     */
    export function normalizeUrl(url: string): string;
    /**
     * Inject script into document.
     *
     * @param {String} scriptUrl script URL
     */
    export function injectScriptIntoDocument(scriptUrl: string): void;
    /**
     * Inject script into document.
     *
     * @param {String} scriptUrl script URL
     */
    export function injectScriptIntoDocument(scriptUrl: string): void;
    /**
     * Print debug message with prefixed "Web Scrobbler" string.
     *
     * @param {String} text Debug message
     * @param {String} [logType=log] Log type
     */
    export function debugLog(text: string, logType?: string): void;
    /**
     * Print debug message with prefixed "Web Scrobbler" string.
     *
     * @param {String} text Debug message
     * @param {String} [logType=log] Log type
     */
    export function debugLog(text: string, logType?: string): void;
    export const ytVideoIdRegExp: RegExp;
    export const ytDescFirstLine: string;
    export const ytDescLastLine: string;
    export const ytDescSeparator: string;
    export const ytTitleRegExps: {
        pattern: RegExp;
        groups: {
            artist: number;
            track: number;
        };
    }[];
    /**
     * Extract artist and track from Youtube video title.
     *
     * @param {String} videoTitle Youtube video title
     *
     * @return {Object} Object contains artist and track fields
     */
    export function processYtVideoTitle(videoTitle: string): any;
    /**
     * Extract artist and track from Youtube video title.
     *
     * @param {String} videoTitle Youtube video title
     *
     * @return {Object} Object contains artist and track fields
     */
    export function processYtVideoTitle(videoTitle: string): any;
    export function isYtVideoDescriptionValid(desc: any): any;
    export function isYtVideoDescriptionValid(desc: any): any;
    export function parseYtVideoDescription(desc: any): {
        artist: any;
        track: any;
        album: any;
    };
    export function parseYtVideoDescription(desc: any): {
        artist: any;
        track: any;
        album: any;
    };
    /**
     * Parse given video URL and return video ID.
     *
     * @param {String} videoUrl Video URL
     *
     * @return {String} Video ID
     */
    export function getYtVideoIdFromUrl(videoUrl: string): string;
    /**
     * Parse given video URL and return video ID.
     *
     * @param {String} videoUrl Video URL
     *
     * @return {String} Video ID
     */
    export function getYtVideoIdFromUrl(videoUrl: string): string;
    export const scArtistTrackRe: RegExp;
    /**
     * Extract artist and track from SoundCloud track title.
     *
     * @param {String} track SoundCloud track title
     *
     * @return {Object} Object contains artist and track fields
     */
    export function processSoundCloudTrack(track: string): any;
    /**
     * Extract artist and track from SoundCloud track title.
     *
     * @param {String} track SoundCloud track title
     *
     * @return {Object} Object contains artist and track fields
     */
    export function processSoundCloudTrack(track: string): any;
}
