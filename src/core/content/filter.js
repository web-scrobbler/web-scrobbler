'use strict';

const escapeHtmlEntityMap = {
	'&': /&amp;/g,
	'<': /&lt;/g,
	'>': /&gt;/g,
	'"': /&quot;/g,
};

/**
 * Base filter object that filters metadata fields by given filter set.
 * A filter set is an object containing 'artist', 'track', 'album' or 'all'
 * properties. Each property can be defined either as a filter function or as
 * an array of filter functions. The 'artist', 'track' and 'album' properties
 * are used to define functions to filter artist, track and album metadata
 * fields respectively. The 'all' property can be used to define common filter
 * functions for all metadata fields.
 *
 * Filter function is a function which takes non-null string argument
 * and returns modified string.
 */
class MetadataFilter {
	/**
	 * @constructor
     * @param {Object} filterSet Set of filters
     */
	constructor(filterSet) {
		this.mergedFilterSet = {};
		this.appendFilters(filterSet);
	}

	/**
	 * Filter field using filters for given field.
	 * @param  {String} field Metadata field
	 * @param  {String} text String to be filtered
	 * @return {String} Filtered string
	 */
	filterField(field, text) {
		return this.filterText(text, this.mergedFilterSet[field]);
	}

	/**
	 * Append new filter set to existing filters.
	 * @param  {Object} filterSet Set of filters
	 * @return {MetadataFilter} Current instance
	 */
	append(filterSet) {
		this.appendFilters(filterSet);
		return this;
	}

	/**
	 * Extend filter set by filter set from given filter.
	 * @param  {Object} filter Filter object
	 * @return {MetadataFilter} Current instance
	 */
	extend(filter) {
		this.appendFilters(filter.mergedFilterSet);
		return this;
	}

	/**
	 * Internal.
	 */

	/**
	 * Filter text using given filters.
	 * @param  {String} text String to be filtered
	 * @param  {Array} filters Array of filter functions
	 * @return {String} Filtered string
	 */
	filterText(text, filters) {
		if (!text) {
			return text;
		}

		for (let filter of filters) {
			text = filter(text);
		}

		return text;
	}

	/**
	 * Convert given filters into array of filters.
	 * @param  {Any} filters Array of filter functions or filter function
	 * @return {Array} Array of filter funcions
	 */
	createFilters(filters) {
		if (typeof filters === 'function') {
			let filterFunction = filters;
			return [filterFunction];
		} else if (Array.isArray(filters)) {
			return filters;
		}

		throw new Error(`Invalid filter type: ${typeof filters}`);
	}

	/**
	 * Add given filters to current ones.
     * @param {Object} filterSet Set of filters
	 */
	appendFilters(filterSet) {
		for (let field of ['artist', 'track', 'album']) {
			if (this.mergedFilterSet[field] === undefined) {
				this.mergedFilterSet[field] = [];
			}

			if (filterSet[field]) {
				this.mergedFilterSet[field] = this.mergedFilterSet[field]
					.concat(this.createFilters(filterSet[field]));
			}

			if (filterSet.all) {
				this.mergedFilterSet[field] = this.mergedFilterSet[field]
					.concat(this.createFilters(filterSet.all));
			}
		}
	}

	/**
	 * Predefined filter functions.
	 */

	/**
	 * Trim given string.
	 * @param  {String} text String to be trimmed
	 * @return {String}	Trimmed string
	 */
	static trim(text) {
		return text.trim();
	}

	/**
	 * Replace non-braking space symbol with space symbol.
	 * @param  {String} text String to be filtered
	 * @return {String}	Filtered string
	 */
	static replaceNbsp(text) {
		return text.replace('\u00a0', '\u0020');
	}

	/**
	 * Remove zero-width characters from given string.
	 * @param  {String} text String to be filtered
	 * @return {String} Filtered string
	 */
	static removeZeroWidth(text) {
		return text.replace(/[\u200B-\u200D\uFEFF]/g, '');
	}

	/**
	 * Decode HTML entities in given text string.
	 * @param  {String} text String with HTML entities
	 * @return {String} Decoded string
	 */
	static decodeHtmlEntities(text) {
		for (let target in escapeHtmlEntityMap) {
			let source = escapeHtmlEntityMap[target];
			text = text.replace(source, target);
		}

		text = text.replace(/&#x([a-fA-f0-9]+);/g, (match, hex) => {
			let dec = parseInt(hex, 16);
			return String.fromCharCode(dec);
		});
		text = text.replace(/&#(\d+);/g, (match, dec) => {
			return String.fromCharCode(dec);
		});

		return text;
	}

	/**
	 * Remove Youtube-related garbage from the text.
	 * @param  {String} text String to be filtered
	 * @return {String} Filtered string
	 */
	static youtube(text) {
		return MetadataFilter.filterWithFilterSet(
			text, MetadataFilter.YOUTUBE_TRACK_FILTERS
		);
	}

	/**
	 * Remove "Remastered..."-like strings from the text.
	 * @param  {String} text String to be filtered
	 * @return {String} Filtered string
	 */
	static removeRemastered(text) {
		return MetadataFilter.filterWithFilterSet(
			text, MetadataFilter.REMASTERED_FILTERS
		);
	}

	/**
	 * Remove "Live..."-like strings from the text.
	 * @param  {String} text String to be filtered
	 * @return {String} Filtered string
	 */
	static removeLive(text) {
		return MetadataFilter.filterWithFilterSet(
			text, MetadataFilter.LIVE_FILTERS
		);
	}

	/**
	 * Replace "Title - X Remix" suffix with "Title (X Remix) and similar".
	 * @param  {String} text String to be filtered
	 * @return {String} Filtered string
	 */
	static fixTrackSuffix(text) {
		return MetadataFilter.filterWithFilterSet(
			text, MetadataFilter.SUFFIX_FILTERS
		);
	}

	/**
	 * "REAL_TITLE : REAL_TILE" -> "REAL_TITLE"
	 * @param  {String} text String to be filtered
	 * @return {String} Filtered string
	 */
	static removeDoubleTitle(text) {
		const splitted = text.split(' : ');
		if (splitted.length !== 2 || splitted[0] !== splitted[1]) {
			return text;
		}
		return splitted[0];
	}


	/**
	 * Replace text according to given filter set rules.
	 * @param  {String} text String to be filtered
	 * @param  {Object} set  Array of replace rules
	 * @return {String} Filtered string
	 */
	static filterWithFilterSet(text, set) {
		for (let data of set) {
			text = text.replace(data.source, data.target);
		}

		return text;
	}

	/**
	 * The filter set is an array that contains replace rules.
	 *
	 * Each rule is an object that contains 'source' and 'target' properties.
	 * 'Source' property is a string or RegEx object which is replaced by
	 * 'target' property value.
	 */

	/**
	 * Predefined regex-based filter set for Youtube-based connectors.
	 * @type {Array}
	 */
	static get YOUTUBE_TRACK_FILTERS() {
		return [
			// Trim whitespaces
			{ source: /^\s+|\s+$/g, target: '' },
			// **NEW**
			{ source: /\s*\*+\s?\S+\s?\*+$/, target: '' },
			// [whatever]
			{ source: /\s*\[[^\]]+\]$/, target: '' },
			// (whatever version)
			{ source: /\s*\([^)]*version\)$/i, target: '' },
			// video extensions
			{ source: /\s*\.(avi|wmv|mpg|mpeg|flv)$/i, target: '' },
			// (LYRICs VIDEO)
			{ source: /\s*((with)?\s*lyrics?( video)?\s*)/i, target: '' },
			// (Official Track Stream)
			{ source: /\s*(Official Track Stream*)/i, target: '' },
			// (official)? (music)? video
			{ source: /\s*(of+icial\s*)?(music\s*)?video/i, target: '' },
			// (official)? (music)? audio
			{ source: /\s*(of+icial\s*)?(music\s*)?audio/i, target: '' },
			// (ALBUM TRACK)
			{ source: /\s*(ALBUM TRACK\s*)?(album track\s*)/i, target: '' },
			// (Cover Art)
			{ source: /\s*(COVER ART\s*)?(Cover Art\s*)/i, target: '' },
			// (official)
			{ source: /\s*\(\s*of+icial\s*\)/i, target: '' },
			// (1999)
			{ source: /\s*\(\s*[0-9]{4}\s*\)/i, target: '' },
			// HD (HQ)
			{ source: /\s+\(\s*(HD|HQ)\s*\)$/, target: '' },
			// HD (HQ)
			{ source: /\s+(HD|HQ)\s*$/, target: '' },
			// video clip officiel
			{ source: /\s*(vid[\u00E9e]o)?\s*clip officiel/i, target: '' },
			// offizielles
			{ source: /\s*of+iziel+es\s*/i, target: '' },
			// video clip
			{ source: /\s*(vid[\u00E9e]o)?\s*clip/i, target: '' },
			// Full Album
			{ source: /\s*full\s*album/i, target: '' },
			// live
			{ source: /\s+\(?live.*?\)?$/i, target: '' },
			// | something
			{ source: /\|.*$/i, target: '' },
			// Leftovers after e.g. (official video)
			{ source: /\(+\s*\)+/, target: '' },
			// Artist - The new "Track title" featuring someone
			{ source: /^(|.*\s)"(.{5,})"(\s.*|)$/, target: '$2' },
			// 'Track title'
			{ source: /^(|.*\s)'(.{5,})'(\s.*|)$/, target: '$2' },
			// (*01/01/1999*)
			{ source: /\s*\(.*[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4}.*\)/i, target: '' },

			// trim starting white chars and dash
			{ source: /^[/,:;~-\s"]+/, target: '' },
			// trim trailing white chars and dash
			{ source: /[/,:;~-\s"!]+$/, target: '' },
		];
	}

	/**
	 * A regex-based filter set that contains removal rules of "Remastered..."-like
	 * strings from a text. Used by Spotify and Deezer connectors.
	 * @type {Array}
	 */
	static get REMASTERED_FILTERS() {
		return [
			// Here Comes The Sun - Remastered
			{ source: /-\sRemastered$/, target: '' },
			// Hey Jude - Remastered 2015
			{ source: /-\sRemastered\s\d+$/, target: '' },
			// Let It Be (Remastered 2009)
			{ source: /\(Remastered\s\d+\)$/, target: '' },
			// Pigs On The Wing (Part One) [2011 - Remaster]
			{ source: /\[\d+\s-\sRemaster\]$/, target: '' },
			// Comfortably Numb (2011 - Remaster)
			{ source: /\(\d+\s-\sRemaster\)$/, target: '' },
			// Outside The Wall - 2011 - Remaster
			{ source: /-\s\d+\s-\sRemaster$/, target: '' },
			// Learning To Fly - 2001 Digital Remaster
			{ source: /-\s\d+\s.+?\sRemaster$/, target: '' },
			// Your Possible Pasts - 2011 Remastered Version
			{ source: /-\s\d+\sRemastered Version$/, target: '' },
			// Roll Over Beethoven (Live / Remastered)
			{ source: /\(Live\s\/\sRemastered\)$/i, target: '' },
			// Ticket To Ride - Live / Remastered
			{ source: /-\sLive\s\/\sRemastered$/, target: '' },
			// Mothership (Remastered)
			// How The West Was Won [Remastered]
			{ source: /[([]Remastered[)\]]$/, target: '' },
		];
	}

	static get LIVE_FILTERS() {

		return [
			// Track - Live
			{ source: /-\sLive?$/, target: '' },
			// Track - Live at
			{ source: /-\sLive\s.+?$/, target: '' },
		];
	}

	static get SUFFIX_FILTERS() {
		return [
			// "- X Remix" -> "(X Remix)" and similar
			{ source: /-\s(.+?)\s((Re)?mix|edit|dub|mix|vip|version)$/i, target: '($1 $2)' },
			{ source: /-\s(Remix|VIP)$/i, target: '($1)' },
		];
	}


	/**
	 * Get simple trim filter object used by default in a Connector object.
	 * @return {MetadataFilter} Filter object
	 */
	static getDefaultFilter() {
		return new MetadataFilter({
			artist: [MetadataFilter.trim, MetadataFilter.replaceNbsp],
			track: [MetadataFilter.trim, MetadataFilter.replaceNbsp],
			album: [MetadataFilter.trim, MetadataFilter.replaceNbsp]
		});
	}

	/**
	 * Get predefined filter object for Youtube-based connectors.
	 * @return {MetadataFilter} Filter object
	 */
	static getYoutubeFilter() {
		return new MetadataFilter({
			track: MetadataFilter.youtube
		});
	}

	/**
	 * Get predefined filter object that uses 'removeRemastered' function.
	 * @return {MetadataFilter} Filter object
	 */
	static getRemasteredFilter() {
		return new MetadataFilter({
			track: MetadataFilter.removeRemastered,
			album: MetadataFilter.removeRemastered,
		});
	}

	/**
	 * Get predefined filter object that uses 'removeRemastered' function.
	 * @return {MetadataFilter} Filter object
	 */
	static getSpotifyFilter() {
		return new MetadataFilter({
			track: [
				MetadataFilter.removeRemastered,
				MetadataFilter.fixTrackSuffix,
				MetadataFilter.removeLive,
			],
			album: [
				MetadataFilter.removeRemastered,
				MetadataFilter.fixTrackSuffix,
				MetadataFilter.removeLive,
			],
		});
	}

	/**
	 * Get predefined filter object that uses 'removeDoubleTitle' function.
	 * @return {MetadataFilter} Filter object
	 */
	static getDoubleTitleFilter() {
		return new MetadataFilter({
			track: MetadataFilter.removeDoubleTitle,
		});
	}
}

/**
 * Export MetadataFilter constructor if script is run in Node.js context.
 */
if (typeof module !== 'undefined') {
	module.exports = MetadataFilter;
}
