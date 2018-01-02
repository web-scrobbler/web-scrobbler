'use strict';

/**
 * Tests for 'filter' module.
 */

const expect = require('chai').expect;
const MetadataFilter = require('../../src/core/content/filter');

/**
 * Test data is an array of objects. Each object must contain
 * three fields: 'description', 'source' and 'expected'.
 *
 * 'description' is a test description used by 'it' function.
 * 'source' is an function argument that used to test function.
 * 'expected' is an expected value of function result.
 */

const FILTER_NULL_DATA = [{
	description: 'should not call filter function for null source',
	source: null,
	expected: null
}, {
	description: 'should not call filter function for empty source',
	source: '',
	expected: ''
}];

/**
 * Test data for testing Trim filter.
 * @type {Array}
 */
const TRIM_TEST_DATA = [{
	description: 'should do nothing with clean string',
	source: 'Track Title',
	expected: 'Track Title'
}, {
	description: 'should trim whitespaces',
	source: '  Track Metafield  ',
	expected: 'Track Metafield'
}, {
	description: 'should trim trailing whitespaces',
	source: 'Track Metafield    ',
	expected: 'Track Metafield'
}, {
	description: 'should trim leading whitespaces',
	source: '    Track Metafield',
	expected: 'Track Metafield'
}];

/**
 * Test data for testing Youtube filter.
 * @type {Array}
 */
const YOUTUBE_TEST_DATA = [{
	description: 'should do nothing with clean string',
	source: 'Track Title',
	expected: 'Track Title'
}, {
	description: 'should trim whitespaces',
	source: '  Track Title  ',
	expected: 'Track Title'
}, {
	description: 'should trim leading whitespaces',
	source: '    Track Title',
	expected: 'Track Title'
}, {
	description: 'should trim trailing whitespaces',
	source: 'Track Title    ',
	expected: 'Track Title'
}, {
	description: 'should remove leftovers after e.g. (official video)',
	source: 'Track Title (    )',
	expected: 'Track Title'
}, {
	description: 'should remove empty leftovers after e.g. (official video)',
	source: 'Track Title ()',
	expected: 'Track Title'
}, {
	description: 'should remove "HD" string',
	source: 'Track Title HD',
	expected: 'Track Title'
}, {
	description: 'should remove "HQ" string',
	source: 'Track Title HQ',
	expected: 'Track Title'
}, {
	description: 'should extract title from single quotes',
	source: '\'Track Title\'',
	expected: 'Track Title'
}, {
	description: 'should extract title from double quotes',
	source: '"Track Title" whatever',
	expected: 'Track Title'
}, {
	description: 'should remove .avi extension',
	source: 'Track Title.avi',
	expected: 'Track Title'
}, {
	description: 'should remove .wmv extension',
	source: 'Track Title.wmv',
	expected: 'Track Title'
}, {
	description: 'should remove .mpg extension',
	source: 'Track Title.mpg',
	expected: 'Track Title'
}, {
	description: 'should remove .flv extension',
	source: 'Track Title.flv',
	expected: 'Track Title'
}, {
	description: 'should remove .mpeg extension',
	source: 'Track Title.mpeg',
	expected: 'Track Title'
}, {
	description: 'should remove "**NEW**" string',
	source: 'Track Title **NEW**',
	expected: 'Track Title'
}, {
	description: 'should remove "[whatever]" string',
	source: 'Track Title [Official Video]',
	expected: 'Track Title'
}, {
	description: 'should remove "Video" string',
	source: 'Track Title Video',
	expected: 'Track Title'
}, {
	description: 'should remove "Music Video" string',
	source: 'Track Title Music Video',
	expected: 'Track Title'
}, {
	description: 'should remove "Official Video" string',
	source: 'Track Title Official Video',
	expected: 'Track Title'
}, {
	description: 'should remove "Official Music Video" string',
	source: 'Track Title Official Music Video',
	expected: 'Track Title'
}, {
	description: 'should remove "Audio" string',
	source: 'Track Title Audio',
	expected: 'Track Title'
}, {
	description: 'should remove "Music Audio" string',
	source: 'Track Title Music Audio',
	expected: 'Track Title'
}, {
	description: 'should remove "Official Audio" string',
	source: 'Track Title Official Audio',
	expected: 'Track Title'
}, {
	description: 'should remove "Official Music Audio" string',
	source: 'Track Title Official Music Audio',
	expected: 'Track Title'
}, {
	description: 'should remove "(official)" string',
	source: 'Track Title (Official)',
	expected: 'Track Title'
}, {
	description: 'should remove "(oficial)" string',
	source: 'Track Title (Oficial)',
	expected: 'Track Title'
}, {
	description: 'should remove "offizielles Video" string',
	source: 'Track Title offizielles Video',
	expected: 'Track Title'
}, {
	description: 'should remove "video clip officiel" string',
	source: 'Track Title video clip officiel',
	expected: 'Track Title'
}, {
	description: 'should remove "video clip" string',
	source: 'Track Title video clip',
	expected: 'Track Title'
}, {
	description: 'should remove "vid\u00E9o clip" string',
	source: 'Track Title vid\u00E9o clip',
	expected: 'Track Title'
}, {
	description: 'should remove "(YYYY)" string',
	source: 'Track Title (2348)',
	expected: 'Track Title'
}, {
	description: 'should remove "(Whatever version)" string',
	source: 'Track Title (Super Cool Version)',
	expected: 'Track Title'
}, {
	description: 'should remove "(Lyric Video)" string',
	source: 'Track Title (Lyric Video)',
	expected: 'Track Title'
}, {
	description: 'should remove "(Whatever Lyric Video)" string',
	source: 'Track Title (Official Lyric Video)',
	expected: 'Track Title'
}, {
	description: 'should remove "(Lyrics Video)" string',
	source: 'Track Title (Lyrics Video)',
	expected: 'Track Title'
}, {
	description: 'should remove "(Whatever Lyrics Video)" string',
	source: 'Track Title (OFFICIAL LYRICS VIDEO)',
	expected: 'Track Title'
}, {
	description: 'should remove "(Official Track Stream)" string',
	source: 'Track Title (Official Track Stream)',
	expected: 'Track Title'
}, {
	description: 'should remove leading colon',
	source: ':Track Title',
	expected: 'Track Title'
}, {
	description: 'should remove leading semicolon',
	source: ';Track Title',
	expected: 'Track Title'
}, {
	description: 'should remove leading dash',
	source: '-Track Title',
	expected: 'Track Title'
}, {
	description: 'should remove leading double quote',
	source: '"Track Title',
	expected: 'Track Title'
}, {
	description: 'should remove trailing colon',
	source: 'Track Title:',
	expected: 'Track Title'
}, {
	description: 'should remove trailing semicolon',
	source: 'Track Title;',
	expected: 'Track Title'
}, {
	description: 'should remove trailing dash',
	source: 'Track Title-',
	expected: 'Track Title'
}, {
	description: 'should remove trailing double quote',
	source: 'Track Title"',
	expected: 'Track Title'
}];

/**
 * Test data for testing Remastered filter.
 * @type {Array}
 */
const REMASTERED_TEST_DATA = [{
	description: 'should do nothing with clean string',
	source: 'Track Title',
	expected: 'Track Title'
}, {
	description: 'should remove "- Remastered" string',
	source: 'Track Title - Remastered',
	expected: 'Track Title'
}, {
	description: 'should remove "(YYYY - Remaster)" string',
	source: 'Track Title (2011 - Remaster)',
	expected: 'Track Title'
}, {
	description: 'should remove "- Remastered YYYY" string',
	source: 'Track Title - Remastered 2015',
	expected: 'Track Title'
}, {
	description: 'should remove "(Remastered YYYY)" string',
	source: 'Track Title (Remastered 2009)',
	expected: 'Track Title'
}, {
	description: 'should remove "[YYYY - Remaster]" string',
	source: 'Track Title [2011 - Remaster]',
	expected: 'Track Title'
}, {
	description: 'should remove "- YYYY - Remaster" string',
	source: 'Track Title - 2011 - Remaster',
	expected: 'Track Title'
}, {
	description: 'should remove "(Live / Remastered)" string',
	source: 'Track Title (Live / Remastered)',
	expected: 'Track Title'
}, {
	description: 'should remove "- Live / Remastered" string',
	source: 'Track Title - Live / Remastered',
	expected: 'Track Title'
}, {
	description: 'should remove "- YYYY Digital Remaster" string',
	source: 'Track Title - 2001 Digital Remaster',
	expected: 'Track Title'
}, {
	description: 'should remove "- YYYY Remastered Version" string',
	source: 'Track Title - 2011 Remastered Version',
	expected: 'Track Title'
}];

/**
 * Test data for testing 'MetadataFilter.decodeHtmlEntities' function.
 * @type {Array}
 */
const DECODE_HTML_ENTITIES_TEST_DATA = [{
	description: 'should do nothing with clean string',
	source: 'Can\'t Kill Us',
	expected: 'Can\'t Kill Us'
}, {
	description: 'should decode HTML entity',
	source: 'Can&#039;t Kill Us',
	expected: 'Can\'t Kill Us'
}, {
	description: 'should decode HTML entity',
	source: 'Can&#x60;t Kill Us',
	expected: 'Can`t Kill Us'
}, {
	description: 'should decode ampersand symbol',
	source: 'Artist 1 &amp; Artist 2',
	expected: 'Artist 1 & Artist 2'
}, {
	description: 'should decode all HTML entities in string',
	source: 'Artist&#x60;s 1 &amp;&amp; Artist&#x60;s 2',
	expected: 'Artist`s 1 && Artist`s 2'
}, {
	description: 'should not decode invalid HTML entity',
	source: 'Artist 1 &#xzz; Artist 2',
	expected: 'Artist 1 &#xzz; Artist 2'
}];

/**
 * Test data for testing 'MetadataFilter.removeZeroWidth' function.
 * @type {Array}
 */
const REMOVE_ZERO_WIDTH_TEST_DATA = [{
	description: 'should do nothing with clean string',
	source: 'Track Metafield',
	expected: 'Track Metafield'
}, {
	description: 'should remove zero-width characters',
	source: 'Str\u200Ding\u200B',
	expected: 'String'
}, {
	description: 'should remove trailing zero-width characters',
	source: 'String\u200C',
	expected: 'String'
}, {
	description: 'should remove leading zero-width characters',
	source: '\u200DString',
	expected: 'String'
}];

/**
 * Filters data is an array of objects. Each object must contain
 * four fields: 'description', 'filter', 'fields' and 'testData'.
 *
 * 'description' is a test description used by 'it' function.
 * 'filter' is an filter instance.
 * 'fields' is an array of song fields to be filtered.
 * 'testData' contains test data used to test filter.
 */
const FILTERS_DATA = [{
	description: 'Base filter',
	filter: new MetadataFilter({ all: shouldNotBeCalled }),
	fields: ['artist', 'track', 'album'],
	testData: FILTER_NULL_DATA,
}, {
	description: 'Trim filter',
	filter: MetadataFilter.getTrimFilter(),
	fields: ['artist', 'track', 'album'],
	testData: TRIM_TEST_DATA,
}, {
	description: 'Youtube filter',
	filter: MetadataFilter.getYoutubeFilter(),
	fields: ['track'],
	testData: YOUTUBE_TEST_DATA,
}, {
	description: 'Remastered filter',
	filter: MetadataFilter.getRemasteredFilter(),
	fields: ['track', 'album'],
	testData: REMASTERED_TEST_DATA,
}, {
	description: 'removeZeroWidth',
	filter: new MetadataFilter({ all: MetadataFilter.removeZeroWidth }),
	fields: ['artist', 'track', 'album'],
	testData: REMOVE_ZERO_WIDTH_TEST_DATA,
}, {
	description: 'decodeHtmlEntities',
	filter: new MetadataFilter({ all: MetadataFilter.decodeHtmlEntities }),
	fields: ['artist', 'track', 'album'],
	testData: DECODE_HTML_ENTITIES_TEST_DATA,
}];

/**
 * Test filter object.
 * @param  {Object} filter MetadataFilter instance
 * @param  {Array} fields Array of fields to be filtered
 * @param  {Array} testData Array of test data
 */
function testFilter(filter, fields, testData) {
	let filterFunctions = {
		artist: filter.filterArtist.bind(filter),
		track: filter.filterTrack.bind(filter),
		album: filter.filterAlbum.bind(filter)
	};

	for (let field of fields) {
		let filterFunction = filterFunctions[field];

		describe(`${field} field`, function() {
			for (let data of testData) {
				let { description, source, expected } = data;
				it(description, function() {
					expect(expected).to.be.equal(filterFunction(source));
				});
			}
		});
	}
}

/**
 * Function that should not be called.
 * @throws {Error} if is called
 */
function shouldNotBeCalled() {
	throw new Error('This function should not be called');
}

/**
 * Run all tests.
 */
function runTests() {
	for (let data of FILTERS_DATA) {
		let { description, filter, fields, testData } = data;
		describe(description, function() {
			testFilter(filter, fields, testData);
		});
	}
}

module.exports = runTests;
