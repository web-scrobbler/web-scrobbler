'use strict';

/**
 * Tests for Song object.
 */

const expect = require('chai').expect;
const Song = require('../../src/core/background/object/song');

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

const DUMMY_CONNECTOR = {
	label: 'Dummy label'
};

/**
 * Create song object.
 * @param  {Object} parsed Object contains custom parsed data values
 * @param  {Object} processed Object contains custom processed data values
 * @return {Object} Processed song object
 */
function createSong(parsed, processed) {
	let parsedDataCopy = Object.assign({}, parsed || PARSED_DATA);
	let song = Song.buildFrom(parsedDataCopy, DUMMY_CONNECTOR);

	if (processed) {
		for (let field in processed) {
			song.processed[field] = PROCESSED_DATA[field];
		}
	}

	return song;
}

/**
 * Test if song getters return parsed values.
 */
function testParsedMetadataFields() {
	let song = createSong();
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
	let song = createSong(null, PROCESSED_DATA);
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

function testEquals() {
	const song1 = createSong({
		artist: 'Artist', track: 'Title', album: 'Album',
		uniqueID: 'uniqueId1'
	});
	const song2 = createSong({
		artist: 'Artist', track: 'Title', album: 'Album',
		uniqueID: 'uniqueId1'
	});
	const song3 = createSong({
		artist: 'Artist', track: 'Title', album: 'Album',
		uniqueID: 'uniqueId3'
	});

	it('should equal itself', () => {
		expect(song1.equals(song1)).to.be.true;
	});
	it('should equal another song with the same uniqueId', () => {
		expect(song1.equals(song2)).to.be.true;
	});
	it('should not equal song with the different uniqueId', () => {
		expect(song1.equals(song3)).to.be.false;
	});
	it('should not equal non-song object', () => {
		expect(song1.equals(null)).to.be.false;
	});
}

/**
 * Test 'Song.isEmpty' function.
 */
function testIsEmpty() {
	it('should return true if song has no metadata', () => {
		let songs = [
			createSong({ artist: 'Artist', track: null }),
			createSong({ artist: null, track: 'Track' }),
			createSong({ artist: null, track: null })
		];

		for (let song of songs) {
			expect(song.isEmpty()).to.be.true;
		}
	});

	it('should return false if song has metadata', () => {
		let song = createSong();
		expect(song.isEmpty()).to.be.false;
	});
}

function testGetUniqueId() {
	it('should return unique ID if song has parsed unique ID', () => {
		let uniqueId = 'unique';
		let song = createSong({
			artist: 'Artist', track: 'Title', album: 'Album',
			uniqueID: uniqueId
		});
		expect(song.getUniqueId()).to.be.equal(uniqueId);
	});

	it('should return unique ID if song has no parsed unique ID', () => {
		let uniqueId = '8021e94350ed56f71a673b08eaea0888';
		let song = createSong({
			artist: 'Artist', track: 'Title', album: 'Album'
		});
		expect(song.getUniqueId()).to.be.equal(uniqueId);
	});

	it('should not return unique ID if song is empty', () => {
		let song = createSong({});
		expect(song.getUniqueId()).to.be.null;
	});
}

function testGetArtistTrackString() {
	it('should return `Artist - Track` string if song has metadata', () => {
		let song = createSong({ artist: 'Artist', track: 'Track' });
		expect(song.getArtistTrackString()).to.be.equal('Artist — Track');
	});
	it('should return null value if song is empty', () => {
		let song = createSong({ artist: null, track: null });
		expect(song.getArtistTrackString()).to.be.null;
	});
}

/**
 * Run all tests.
 */
function runTests() {
	describe('parsedData', testParsedMetadataFields);
	describe('processedData', testProcessedMetadataFields);

	describe('testEquals', testEquals);
	describe('isSongEmpty', testIsEmpty);
	describe('getUniqueId', testGetUniqueId);
	describe('getArtistTrackString', testGetArtistTrackString);
}

runTests();
