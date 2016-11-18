'use strict';

/* exported MetadataFilter */
/* jshint node: true */

/**
 * Export MetadataFilter constructor if script is run in Node.js context.
 */
if (typeof module !== 'undefined') {
	module.exports = {
		MetadataFilter: MetadataFilter,
	};
}

/**
 * Base filter object that filters metadata fields by given filter set.
 * A filter set is an object containing 'artist', 'track', 'album' or 'all'
 * properties. Each property can be defined either as a filter function or as
 * an array of filter functions. The 'artist', 'track' and 'album' properties
 * are used to define functions to filter artist, track and album metadata
 * fields respectively. The 'all' property can be used to define common filter
 * functions for all metadata fields.
 *
 * @constructor
 * @param {Object} filterSet Set of filters
 */
function MetadataFilter(filterSet) {
	const mergedFilterSet = createMergedFilters(filterSet);

	/**
	 * Filter text using filters for artist metadata field.
	 * @param  {String} text String to be filtered
	 * @return {String} Filtered string
	 */
	this.filterArtist = function(text) {
		return filterField(text, mergedFilterSet.artist);
	};

	/**
	 * Filter text using filters for track metadata field.
	 * @param  {String} text String to be filtered
	 * @return {String} Filtered string
	 */
	this.filterTrack = function(text) {
		return filterField(text, mergedFilterSet.track);
	};

	/**
	 * Filter text using filters for album metadata field.
	 * @param  {String} text String to be filtered
	 * @return {String} Filtered string
	 */
	this.filterAlbum = function(text) {
		return filterField(text, mergedFilterSet.album);
	};

	/**
	 * Filter text using given filters.
	 * @param  {String} text String to be filtered
	 * @param  {Array} filters Array of filter functions
	 * @return {String} Filtered string
	 */
	function filterField(text, filters) {
		if (text === null || text === '') {
			return text;
		}

		filters.forEach(filter => {
			text = filter(text);
		});

		return text;
	}

	function createFilters(filters) {
		if (typeof filters === 'function') {
			let filterFunction = filters;
			return [filterFunction];
		} else if (Object.prototype.toString.call(filters) === '[object Array]') {
			return filters;
		} else {
			return [];
		}
	}

	function createMergedFilters(filterSet) {
		let mergedFilterSet = {};
		for (let field of ['artist', 'track', 'album']) {
			mergedFilterSet[field] = createFilters(filterSet[field])
				.concat(createFilters(filterSet.all));
		}
		return mergedFilterSet;
	}
}

/* Predefined filter functions.
 *
 * Filter function is a function which takes non-null string argument
 * and returns modified string.
 */

/**
 * Trim given string.
 * @param  {String} text String to be trimmed
 * @return {String}	Trimmed string
 */
MetadataFilter.trim = function(text) {
	return text.trim();
};

/**
 * Remove zero-width characters from given string.
 * @param  {String} text String to be filtered
 * @return {String} Filtered string
 */
MetadataFilter.removeZeroWidth = function(text) {
	return text.replace(/[\u200B-\u200D\uFEFF]/g, '');
};

/**
 * Decodes HTML entities in given text string.
 * @param  {String} text String with HTML entities
 * @return {String} Decoded string
 */
MetadataFilter.decodeHtmlEntities = function(text) {
	return text.replace(/&#(\d+);/g, (match, dec) => {
		return String.fromCharCode(dec);
	});
};

/**
 * Remove Youtube-related garbage from the text.
 * @param  {String} text String to be filtered
 * @return {String} Filtered string
 */
MetadataFilter.youtube = function(text) {
	return MetadataFilter.filterWithMap(text, MetadataFilter.YOUTUBE_TRACK_FILTERS);
};

/**
 * Remove "Remastered..."-like strings from the text.
 * @param  {String} text String to be filtered
 * @return {String} Filtered string
 */
MetadataFilter.removeRemastered = function(text) {
	return MetadataFilter.filterWithMap(text, MetadataFilter.REMASTERED_FILTERS);
};

/**
 * Replace text according to given map object.
 * @param  {String} text String to be filtered
 * @param  {Object} map  Object contains rules of replace
 * @return {String} Filtered string
 */
MetadataFilter.filterWithMap = function(text, map) {
	for (let source in map) {
		let target = map[source];

		let regexParts = source.match(new RegExp('^/(.*?)/([img]*)$'));
		if (!regexParts) {
			console.log(`Invalid regex: ${source}`);
			continue;
		}

		let regex = new RegExp(regexParts[1], regexParts[2]);
		text = text.replace(regex, target);
	}

	return text;
};

/**
 * Predefined regex-based filter set for Youtube-based connectors.
 * The filter set is an object that maps regular expressions to strings
 * that will be used as replacement.
 */
MetadataFilter.YOUTUBE_TRACK_FILTERS = {
	'/^\\s+|\\s+$/g': '', // Trim whitespaces
	'/\\s*\\*+\\s?\\S+\\s?\\*+$/': '', // **NEW**
	'/\\s*\\[[^\\]]+\\]$/': '', // [whatever]
	'/\\s*\\([^\\)]*version\\)$/i': '', // (whatever version)
	'/\\s*\\.(avi|wmv|mpg|mpeg|flv)$/i': '', // video extensions
	'/\\s*(LYRIC VIDEO\\s*)?(lyric video\\s*)/i': '', // (LYRIC VIDEO)
	'/\\s*(Official Track Stream*)/i': '', // (Official Track Stream)
	'/\\s*(of+icial\\s*)?(music\\s*)?video/i': '', // (official)? (music)? video
	'/\\s*(of+icial\\s*)?(music\\s*)?audio/i': '', // (official)? (music)? audio
	'/\\s*(ALBUM TRACK\\s*)?(album track\\s*)/i': '', // (ALBUM TRACK)
	'/\\s*(COVER ART\\s*)?(Cover Art\\s*)/i': '', // (Cover Art)
	'/\\s*\\(\\s*of+icial\\s*\\)/i': '', // (official)
	'/\\s*\\(\\s*[0-9]{4}\\s*\\)/i': '', // (1999)
	'/\\s+\\(\\s*(HD|HQ)\\s*\\)$/': '', // HD (HQ)
	'/\\s+(HD|HQ)\\s*$/': '', // HD (HQ)
	'/\\s*video\\s*clip/i': '', // video clip
	'/\\s*full\\s*album/i': '', // Full Album
	'/\\s+\\(?live\\)?$/i': '', // live
	'/\\(+\\s*\\)+/': '', // Leftovers after e.g. (official video)
	'/^(|.*\\s)"(.*)"(\\s.*|)$/': '$2', // Artist - The new "Track title" featuring someone
	'/^(|.*\\s)\'(.*)\'(\\s.*|)$/': '$2', // 'Track title'
	'/^[\\/\\s,:;~-\\s"]+/': '', // trim starting white chars and dash
	'/[\\/\\s,:;~-\\s"\\s!]+$/': '', // trim trailing white chars and dash
};

/**
 * A regex-based filter set that contains removal rules of "Remastered..."-like
 * strings from a text. Used by Spotify and Deezer connectors.
 */
MetadataFilter.REMASTERED_FILTERS = {
	// Here Comes The Sun - Remastered
	'/\\-\\sRemastered$/': '',
	// Hey Jude - Remastered 2015
	'/\\-\\sRemastered\\s\\d+$/': '',
	// Let It Be (Remastered 2009)
	'/\\(Remastered\\s\\d+\\)$/': '',
	// Pigs On The Wing (Part One) [2011 - Remaster]
	'/\\[\\d+\\s-\\sRemaster\\]$/': '',
	// Comfortably Numb (2011 - Remaster)
	'/\\(\\d+\\s-\\sRemaster\\)$/': '',
	// Outside The Wall - 2011 - Remaster
	'/\\-\\s\\d+\\s\\-\\sRemaster$/': '',
	// Learning To Fly - 2001 Digital Remaster
	'/\\-\\s\\d+\\s.+?\\sRemaster$/': '',
	// Your Possible Pasts - 2011 Remastered Version
	'/\\-\\s\\d+\\sRemastered Version$/': '',
	// Roll Over Beethoven (Live / Remastered)
	'/\\(Live\\s/\\sRemastered\\)$/i': '',
	// Ticket To Ride - Live / Remastered
	'/\\-\\sLive\\s/\\sRemastered$/': '',
};

/**
 * Get simple trim filter object used by default in a Connector object.
 * @type {MetadataFilter}
 */
MetadataFilter.getTrimFilter = function() {
	return new MetadataFilter({
		artist: MetadataFilter.trim,
		track: MetadataFilter.trim,
		album: MetadataFilter.trim
	});
};

/**
 * Get predefined filter object for Youtube-based connectors.
 * @type {MetadataFilter}
 */
MetadataFilter.getYoutubeFilter = function() {
	return new MetadataFilter({
		track: MetadataFilter.youtube,
		all: MetadataFilter.trim
	});
};

/**
 * Get predefined filter object that uses 'removeRemastered' function.
 * @type {MetadataFilter}
 */
MetadataFilter.getRemasteredFilter = function() {
	return new MetadataFilter({
		all: MetadataFilter.trim,
		track: MetadataFilter.removeRemastered,
		album: MetadataFilter.removeRemastered
	});
};
