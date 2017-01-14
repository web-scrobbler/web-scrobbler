'use strict';

/**
 * Tests for Song object.
 */

const expect = require('chai').expect;
const Song = require('../../core/background/objects/song');

/**
 * Object that contains source data for Song object.
 * @type {Object}
 */
const PARSED_DATA = {
	artist: 'Artist',
	track: 'Track',
	album: 'Album',
	uniqueID: '{4AC45782-0990-4DCC-9FD0-925EC688FF3C}',
	duration: 320,
	currentTime: 5,
	isPlaying: true,
	trackArt: 'https://example.com/image.png',
	url: 'https://example.com/play'
};
/**
 * Object that contains processed song data.
 * @type {Object}
 */
const PROCESSED_DATA = {
	artist: 'Processed Artist',
	track: 'Processed Track',
	album: 'Processed duration',
	duration: 321
};

/**
 * Create non-processed song object.
 * @param  {Object} customParsedData Object contains custom parsed data values.
 * @return {Object} Non-processed song object
 */
function createNonProcessedSong(customParsedData) {
	let parsedData = PARSED_DATA;
	if (customParsedData) {
		parsedData = Object.assign(parsedData, customParsedData);
	}

	return new Song(parsedData);
}

/**
 * Create processed song object.
 * @param  {Object} customParsedData Object contains custom parsed data values.
 * @return {Object} Processed song object
 */
function createProcessedSong(customParsedData) {
	let song = createNonProcessedSong(customParsedData);

	for (let field in PROCESSED_DATA) {
		song.processed[field] = PROCESSED_DATA[field];
	}

	return song;
}

/**
 * Test if song getters return parsed values.
 */
function testParsedMetadataFields() {
	let song = createNonProcessedSong();
	let valuesMap = {
		artist: {
			expected: PARSED_DATA.artist,
			actual: song.getArtist()
		},
		track: {
			expected: PARSED_DATA.track,
			actual: song.getTrack()
		},
		album: {
			expected: PARSED_DATA.album,
			actual: song.getAlbum()
		},
		duration: {
			expected: PARSED_DATA.duration,
			actual: song.getDuration()
		},
		trackArt: {
			expected: PARSED_DATA.trackArt,
			actual: song.getTrackArt()
		}
	};

	for (let key in valuesMap) {
		let expectedValue = valuesMap[key].expected;
		let actualValue = valuesMap[key].actual;

		it(`should return parsed ${key} value`, () => {
			expect(expectedValue).to.be.equal(actualValue);
		});
	}
}

/**
 * Test if song getters return processed values, except duration.
 */
function testProcessedMetadataFields() {
	let song = createProcessedSong();
	let valuesMap = {
		artist: {
			expected: PROCESSED_DATA.artist,
			actual: song.getArtist()
		},
		track: {
			expected: PROCESSED_DATA.track,
			actual: song.getTrack()
		},
		album: {
			expected: PROCESSED_DATA.album,
			actual: song.getAlbum()
		},
		duration: {
			// Parsed data has a higher priority
			expected: PARSED_DATA.duration,
			actual: song.getDuration()
		}
	};

	for (let key in valuesMap) {
		let expectedValue = valuesMap[key].expected;
		let actualValue = valuesMap[key].actual;

		it(`should return processed ${key} value`, () => {
			expect(expectedValue).to.be.equal(actualValue);
		});
	}
}

/**
 * Test 'Song.getSecondsToScrobble' function.
 */
function testGetSecondsToScrobble() {
	it('should return proper value', () => {
		let song1 = createProcessedSong({duration: 300});
		expect(song1.getSecondsToScrobble()).to.be.equal(150);
	});

	it('should return proper value for songs longer that 4 minutes', () => {
		let song1 = createProcessedSong({duration: 600});
		expect(song1.getSecondsToScrobble()).to.be.equal(240);
	});
}

/**
 * Run all tests.
 */
function runTests() {
	describe('parsedData', testParsedMetadataFields);
	describe('processedData', testProcessedMetadataFields);

	describe('secondsToScrobble', testGetSecondsToScrobble);
}

module.exports = runTests;
