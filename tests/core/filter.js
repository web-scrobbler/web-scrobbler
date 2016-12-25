'use strict';

require('chai').should();

const MetadataFilter = require('../../core/content/filter').MetadataFilter;

/**
 * Test data is an array of objects. Each object must contain
 * two fields: 'source' and 'target'.
 */

const TRIM_TEST_DATA = [
	// Should do nothing with clean string
	{source: 'Track Title', target: 'Track Title'},

	{source: 'Track Metafield    ', target: 'Track Metafield'},
	{source: '  Track Metafield  ', target: 'Track Metafield'},
	{source: '    Track Metafield', target: 'Track Metafield'}
];

const REPLACE_HTML_ENTITIES_TEST_DATA = [
	// Should do nothing with clean string
	{source: 'Can\'t Kill Us', target: 'Can\'t Kill Us'},

	{source: 'Can&#039;t Kill Us', target: 'Can\'t Kill Us'}
];

const REMOVE_ZERO_WIDTH_TEST_DATA = [
	// Should do nothing with clean string
	{source: 'Track Metafield', target: 'Track Metafield'},

	{source: 'String\u200C', target: 'String'},
	{source: 'Str\u200Ding\u200B', target: 'String'},
	{source: '\u200DString\u200D', target: 'String'},
];

const YOUTUBE_TEST_DATA = [
	// Should do nothing with clean string
	{source: 'Track Title', target: 'Track Title'},

	// Leftovers after e.g. (official video)
	{source: 'Track Title ()', target: 'Track Title'},

	// HD/HQ
	{source: 'Track Title HD', target: 'Track Title'},
	{source: 'Track Title HQ', target: 'Track Title'},

	// 'Track title'
	{source: '\'Track Title\'', target: 'Track Title'},

	// Trim whitespaces
	{source: 'Track Title    ', target: 'Track Title'},
	{source: '  Track Title  ', target: 'Track Title'},
	{source: '    Track Title', target: 'Track Title'},
	// (HD)/(HQ)
	{source: 'Track Title (HD)', target: 'Track Title'},
	{source: 'Track Title (HD )', target: 'Track Title'},
	{source: 'Track Title ( HD)', target: 'Track Title'},
	{source: 'Track Title (HQ)', target: 'Track Title'},
	{source: 'Track Title (HQ )', target: 'Track Title'},
	{source: 'Track Title ( HQ)', target: 'Track Title'},
	// Video extensions
	{source: 'Track Title.avi', target: 'Track Title'},
	{source: 'Track Title.wmv', target: 'Track Title'},
	{source: 'Track Title.mpg', target: 'Track Title'},
	{source: 'Track Title.flv', target: 'Track Title'},
	{source: 'Track Title.mpeg', target: 'Track Title'},
	// **NEW**
	{source: 'Track Title **NEW**', target: 'Track Title'},

	// Artist - The new "Track title" featuring someone
	{source: '"Track Title" whatever', target: 'Track Title'},

	// [whatever]
	{source: 'Track Title [Official Video]', target: 'Track Title'},

	// (official)? (music)? video
	{source: 'Track Title (Video)', target: 'Track Title'},
	{source: 'Track Title (Music Video)', target: 'Track Title'},
	{source: 'Track Title (Official Video)', target: 'Track Title'},
	{source: 'Track Title (Official Music Video)', target: 'Track Title'},

	// (official)
	{source: 'Track Title (Official)', target: 'Track Title'},
	{source: 'Track Title (Official )', target: 'Track Title'},
	{source: 'Track Title ( Official)', target: 'Track Title'},

	// (1999)
	{source: 'Track Title (2348)', target: 'Track Title'},
	{source: 'Track Title (2029 )', target: 'Track Title'},
	{source: 'Track Title ( 1235)', target: 'Track Title'},

	// (official)? (music)? audio
	{source: 'Track Title (Audio)', target: 'Track Title'},
	{source: 'Track Title (Music Audio)', target: 'Track Title'},
	{source: 'Track Title (Official Audio)', target: 'Track Title'},
	{source: 'Track Title (Official Music Audio)', target: 'Track Title'},

	// Whatever version
	{source: 'Track Title (Super Cool Version)', target: 'Track Title'},

	// (LYRIC VIDEO)
	{source: 'Track Title (Official Lyric Video)', target: 'Track Title'},

	// (Official Track Stream)
	{source: 'Track Title (Official Track Stream)',	target: 'Track Title'},
];

const REMASTERED_TEST_DATA = [
	// Should do nothing with clean string
	{source: 'Track Title', target: 'Track Title'},

	{source: 'Track Title - Remastered',	target: 'Track Title'},
	{source: 'Track Title (2011 - Remaster)', target: 'Track Title'},
	{source: 'Track Title - Remastered 2015', target: 'Track Title'},
	{source: 'Track Title (Remastered 2009)', target: 'Track Title'},
	{source: 'Track Title [2011 - Remaster]', target: 'Track Title'},
	{source: 'Track Title - 2011 - Remaster', target: 'Track Title'},
	{source: 'Track Title (Live / Remastered)',	target: 'Track Title'},
	{source: 'Track Title - Live / Remastered', target: 'Track Title'},
	{source: 'Track Title - 2001 Digital Remaster',	target: 'Track Title'},
	{source: 'Track Title - 2011 Remastered Version', target: 'Track Title'},
];

function testTrimFilter() {
	let filter = MetadataFilter.getTrimFilter();

	testFilterFunction(filter.filterArtist, TRIM_TEST_DATA);
	testFilterFunction(filter.filterTrack, TRIM_TEST_DATA);
	testFilterFunction(filter.filterAlbum, TRIM_TEST_DATA);
}

function testYoutubeFilter() {
	let filter = MetadataFilter.getYoutubeFilter();

	testFilterFunction(filter.filterTrack, YOUTUBE_TEST_DATA);
}

function testRemasteredFilter() {
	let filter = MetadataFilter.getRemasteredFilter();

	testFilterFunction(filter.filterTrack, REMASTERED_TEST_DATA);
	testFilterFunction(filter.filterAlbum, REMASTERED_TEST_DATA);
}

function testReplaceHtmlEntitiesFunction() {
	let filter = new MetadataFilter({all: MetadataFilter.decodeHtmlEntities});

	testFilter(filter, REPLACE_HTML_ENTITIES_TEST_DATA);
}

function testRemoveZeroWidthCharsFunctions() {
	let filter = new MetadataFilter({all: MetadataFilter.removeZeroWidth});

	testFilter(filter, REMOVE_ZERO_WIDTH_TEST_DATA);
}

/**
 * Helper functions.
 */

function testFilter(filter, testData) {
	let filterFunctions = [
		filter.filterArtist, filter.filterTrack, filter.filterAlbum
	];

	for (let filterFunction of filterFunctions) {
		testFilterFunction(filterFunction, testData);
	}
}

function testFilterFunction(filterFieldFunction, testData) {
	for (let test of testData) {
		filterFieldFunction(test.source).should.equal(test.target);
	}
}

function runTests() {
	it('should trim text', testTrimFilter);
	it('should remove Youtube garbage', testYoutubeFilter);
	it('should remove Remastered strings', testRemasteredFilter);

	it('should replace HTML entities', testReplaceHtmlEntitiesFunction);
	it('should remove zero-width chars', testRemoveZeroWidthCharsFunctions);
}

module.exports = runTests;
