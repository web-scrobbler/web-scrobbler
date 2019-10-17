'use strict';

/**
 * Tests for 'util' module.
 */

const expect = require('chai').expect;
const Util = require('../../src/core/content/util');

/**
 * Test data is an array of objects. Each object must contain
 * three fields: 'description', 'source' and 'expected'.
 *
 * 'description' is a test description used by 'it' function.
 * 'source' is an function argument that used to test function.
 * 'expected' is an expected value of function result.
 */

/**
 * Test data for testing 'Util.splitArtistTrack' function.
 * @type {Array}
 */
const SPLIT_ARTIST_TRACK_TEST_DATA = [{
	description: 'should split artist and track',
	source: 'Artist - Track',
	expected: { artist: 'Artist', track: 'Track' },
	swap: false,
}, {
	description: 'should split artist and track by custom separator',
	source: 'Artist * Track',
	expected: { artist: 'Artist', track: 'Track' },
	separators: [' * '],
	swap: false,
}, {
	description: 'should not split malformed string',
	source: 'Artist & Track',
	expected: Util.makeEmptyArtistTrack(),
	swap: false,
}, {
	description: 'should split artist and track, and swap them',
	source: 'Track - Artist',
	expected: { artist: 'Artist', track: 'Track' },
	swap: true,
}];

/**
 * Test data for testing 'Util.escapeBadTimeValues' function.
 * @type {Array}
 */
const ESCAPE_BAD_TIME_VALUES_DATA = [{
	description: 'should round float number',
	source: 3.25,
	expected: 3
}, {
	description: 'should return null for NaN',
	source: NaN,
	expected: null
}, {
	description: 'should return null for Infinity',
	source: Infinity,
	expected: null
}, {
	description: 'should return null for -Infinity',
	source: -Infinity,
	expected: null
}, {
	description: 'should return integer number as is',
	source: 3,
	expected: 3
}];

/**
 * Test data for testing 'Util.stringToSeconds' function.
 * @type {Array}
 */
const STRING_TO_SECONDS_DATA = [{
	description: 'should trim string and parse time',
	source: '01:10:30 ',
	expected: 4230
}, {
	description: 'should parse time in hh:mm:ss format',
	source: '01:10:30',
	expected: 4230
}, {
	description: 'should parse negative time',
	source: '-01:10',
	expected: -70
}, {
	description: 'should parse time in mm:ss format',
	source: '05:20',
	expected: 320
}, {
	description: 'should parse time in ss format',
	source: '20',
	expected: 20
}, {
	description: 'should not parse empty string',
	source: '',
	expected: 0
}, {
	description: 'should not parse null value',
	source: null,
	expected: 0
}, {
	description: 'should not parse malformed format',
	source: NaN,
	expected: 0
}];

/**
 * Test data for testing 'Util.extractUrlFromCssProperty' function.
 * @type {Array}
 */
const EXRACT_TRACK_ART_FROM_CSS_DATA = [{
	description: 'should extract URL from CSS property (double quotes)',
	source: 'url("http://example.com/image.png")',
	expected: 'http://example.com/image.png'
}, {
	description: 'should extract URL from CSS property (single quotes)',
	source: 'url(\'http://example.com/image.png\')',
	expected: 'http://example.com/image.png'
}, {
	description: 'should extract URL from CSS property (no quotes)',
	source: 'url(http://example.com/image.png)',
	expected: 'http://example.com/image.png'
}, {
	description: 'should extract URL from shorthand CSS property',
	source: '#ffffff url("http://example.com/image.png") no-repeat right top;',
	expected: 'http://example.com/image.png'
}, {
	description: 'should return null for malformed CSS property',
	source: 'whatever',
	expected: null
}];

/**
 * Test data for testing 'Util.getYoutubeVideoIdFromUrl' function.
 * @type {Array}
 */
const GET_YOUTUBE_VIDEO_ID_FROM_URL_DATA = [{
	description: 'should return video ID from URL',
	source: 'https://www.youtube.com/watch?v=JJYxNSRX6Oc',
	expected: 'JJYxNSRX6Oc',
}, {
	description: 'should return video ID from URL with several params',
	source: 'https://www.youtube.com/watch?v=JJYxNSRX6Oc&t=92s',
	expected: 'JJYxNSRX6Oc',
}, {
	description: 'should return video ID from URL when "v" param is in the end of query',
	source: 'https://www.youtube.com/watch?list=PLjTdkvaV6GM-J-6PHx9Cw5Cg2tI5utWe7&v=ALZHF5UqnU4',
	expected: 'ALZHF5UqnU4',
}, {
	description: 'should return video ID from short URL',
	source: 'https://youtu.be/Mssm8Ml5sOo',
	expected: 'Mssm8Ml5sOo',
}, {
	description: 'should return video ID from embed video URL',
	source: 'https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&origin=http://example.com',
	expected: 'M7lc1UVf-VE',
}];

/**
 * Test data for testing 'Util.processYoutubeVideoTitle' function.
 * @type {Array}
 */
const PROCESS_YOUTUBE_TITLE_DATA = [{
	description: 'should process youtube tilte',
	source: 'Artist - Track',
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should remove [genre] from the beginning of the title',
	source: '[Genre] Artist - Track',
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should remove 【genre】 from the beginning of the title',
	source: '【Genre】 Artist - Track',
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should process text string w/o separators',
	source: 'Artist "Track"',
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should process Japanese tracks',
	source: 'Artist「Track」',
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should process inverted tracks with parens',
	source: 'Track (by Artist)',
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should process inverted tracks with parens and comments',
	source: 'Track (cover by Artist) Studio',
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should process inverted tracks with parens original artist',
	source: 'Original Artist - Track (cover by Artist)',
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should process tracks with seperators and quotes',
	source: 'Artist - "Track Name"',
	expected: { artist: 'Artist', track: 'Track Name' }
}, {
	description: 'should process tracks with seperators without leading whitespace and quotes',
	source: 'Artist: "Track Name"',
	expected: { artist: 'Artist', track: 'Track Name' }
}, {
	description: 'should use title as track title',
	source: 'Track Name',
	expected: { artist: null, track: 'Track Name' }
}];

/**
 * Test data for testing 'Util.processSoundCloudTrack' function.
 * @type {Array}
 */
const PROCESS_SOUNDCLOUD_TRACK_DATA = [{
	description: 'should process SoundCloud title (hyphen)',
	source: 'Artist - Track',
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should process SoundCloud title (en dash)',
	source: 'Artist \u2013 Track',
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should process SoundCloud title (em dash)',
	source: 'Artist \u2014 Track',
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should process SoundCloud title (horizontal bar)',
	source: 'Artist \u2015 Track',
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should use title as track title',
	source: 'Track Name',
	expected: { artist: null, track: 'Track Name' }
}];

/**
 * Test data for testing 'Util.splitTimeInfo' function.
 *
 * This test data contains additions properties: 'swap' and 'separators'.
 * These properties are uses as arguments of 'splitTimeInfo' function.
 * @type {Array}
 */
const SPLIT_TIME_INFO_DATA = [{
	description: 'should split time info',
	source: '01:00 / 03:00',
	expected: { currentTime: 60, duration: 180 },
	swap: false,
	separators: ['/']
}, {
	description: 'should split time info and swap values',
	source: '03:00 / 01:00',
	expected: { currentTime: 60, duration: 180 },
	swap: true,
	separators: ['/']
}, {
	description: 'should not split malformed time info text',
	source: '01:10:30',
	expected: { currentTime: null, duration: null },
	swap: false,
	separators: ['/']
}];

const FIND_SEPARATOR_DATA = [{
	description: 'should find separator',
	source: 'Key : Var',
	expected: { index: 4, length: 1 },
}, {
	description: 'should find custom separator',
	source: 'Key * Var',
	expected: { index: 3, length: 3 },
	separators: [' * ']
}, {
	description: 'should not find separator if no separator in string',
	source: 'Key 2 Var',
	expected: null,
}];

const IS_ARTIST_TRACK_EMPTY_DATA = [{
	description: 'should return true for empty Artist-Track pair',
	source: { artist: null, track: null },
	expected: true
}, {
	description: 'should return false for non-empty Artist-Track pair',
	source: { artist: 'Artist', track: 'Track' },
	expected: false
}];

/**
 * Test 'Util.splitArtistTrack' function.
 */
function testSplitArtistTrack() {
	for (let data of SPLIT_ARTIST_TRACK_TEST_DATA) {
		let { description, source, expected, separators, swap } = data;
		let actual = Util.splitArtistTrack(source, separators, { swap });

		it(description, function() {
			expect(actual).to.be.deep.equal(expected);
		});
	}
}

/**
 * Test 'Util.escapeBadTimeValues' function.
 */
function testGetYoutubeVideoIdFromUrl() {
	testFunction(Util.getYoutubeVideoIdFromUrl, GET_YOUTUBE_VIDEO_ID_FROM_URL_DATA);
}


/**
 * Test 'Util.escapeBadTimeValues' function.
 */
function testEscapeBadTimeValues() {
	testFunction(Util.escapeBadTimeValues, ESCAPE_BAD_TIME_VALUES_DATA);
}

/**
 * Test 'Util.stringToSeconds' function.
 */
function testStringToSeconds() {
	testFunction(Util.stringToSeconds, STRING_TO_SECONDS_DATA);
}

/**
 * Test 'Util.stringToSeconds' function.
 */
function testExtractTrackArtFromCss() {
	testFunction(Util.extractUrlFromCssProperty, EXRACT_TRACK_ART_FROM_CSS_DATA);
}

/**
 * Test 'Util.processYoutubeVideoTitle' function.
 */
function testProcessYoutubeVideoTitle() {
	for (let data of PROCESS_YOUTUBE_TITLE_DATA) {
		let { description, source, expected } = data;
		let actual = Util.processYoutubeVideoTitle(source);

		it(description, function() {
			expect(actual).to.be.deep.equal(expected);
		});
	}
}

/**
 * Test 'Util.processYoutubeVideoTitle' function.
 */
function testProcessSoundCloudTrack() {
	for (let data of PROCESS_SOUNDCLOUD_TRACK_DATA) {
		let { description, source, expected } = data;
		let actual = Util.processSoundCloudTrack(source);

		it(description, function() {
			expect(actual).to.be.deep.equal(expected);
		});
	}
}

/**
 * Test 'Util.splitTimeInfo' function.
 */
function testSplitTimeInfo() {
	for (let data of SPLIT_TIME_INFO_DATA) {
		let { description, source, expected, swap, separators } = data;
		let actual = Util.splitTimeInfo(source, separators, { swap });

		it(description, function() {
			expect(actual).to.be.deep.equal(expected);
		});
	}
}

/**
 * Test 'Util.findSeparator' function.
 */
function testFindSeparator() {
	for (let data of FIND_SEPARATOR_DATA) {
		let { description, source, expected, separators } = data;
		let actual = Util.findSeparator(source, separators);

		it(description, function() {
			expect(actual).to.be.deep.equal(expected);
		});
	}
}

/**
 * Test 'Util.findSeparator' function.
 */
function testIsArtistTrackEmpty() {
	testFunction(Util.isArtistTrackEmpty, IS_ARTIST_TRACK_EMPTY_DATA);
}

/**
 * Test function.
 * @param  {Function} func Function to be tested
 * @param  {Array} testData Array of test data
 */
function testFunction(func, testData) {
	const boundFunc = func.bind(Util);

	for (let data of testData) {
		let { description, source, expected } = data;
		let actual = boundFunc(source);

		it(description, function() {
			expect(actual).to.be.equal(expected);
		});
	}
}

/**
 * Run all tests.
 */
function runTests() {
	describe('findSeparator', testFindSeparator);
	describe('splitTimeInfo', testSplitTimeInfo);
	describe('stringToSeconds', testStringToSeconds);
	describe('splitArtistTrack', testSplitArtistTrack);
	describe('isArtistTrackEmpty', testIsArtistTrackEmpty);
	describe('escapeBadTimeValues', testEscapeBadTimeValues);
	describe('extractUrlFromCssProperty', testExtractTrackArtFromCss);
	describe('processYoutubeVideoTitle', testProcessYoutubeVideoTitle);
	describe('getYoutubeVideoIdFromUrl', testGetYoutubeVideoIdFromUrl);
	describe('testProcessSoundCloudTrack', testProcessSoundCloudTrack);
}

runTests();
