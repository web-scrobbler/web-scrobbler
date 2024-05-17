import { expect, it, describe } from 'vitest';
import type { ParsedSongData, ProcessedSongData } from '@/core/object/song';
import Song from '@/core/object/song';
import type { State } from '@/core/types';

/**
 * Tests for Song object.
 */

const defaultParsedData = {
	album: null,
	albumArtist: null,
	artist: null,
	currentTime: null,
	duration: null,
	isPlaying: true,
	isPodcast: false,
	originUrl: null,
	track: null,
	trackArt: null,
	uniqueID: null,
};

/**
 * Object that contains source data for Song object.
 */
const PARSED_DATA = {
	artist: 'Artist',
	track: 'Track',
	album: 'Album',
	albumArtist: 'AlbumArtist',
	uniqueID: '{4AC45782-0990-4DCC-9FD0-925EC688FF3C}',
	duration: 320,
	currentTime: 5,
	isPlaying: true,
	originUrl: 'https://example.com/play',
	trackArt: 'https://example.com/image.png',
};
/**
 * Object that contains processed song data.
 */
const PROCESSED_DATA = {
	artist: 'Processed Artist',
	track: 'Processed Track',
	album: 'Processed duration',
	albumArtist: 'Processed AlbumArtist',
	duration: 321,
};

const DUMMY_CONNECTOR = {
	label: 'Dummy label',
	js: 'Dummy js',
	matches: ['Dummy match'],
	id: 'Dummy id',
};

/**
 * Create song object.
 * @param  parsedData - Object contains custom parsed data values
 * @param  processedData - Object contains custom processed data values
 * @returns Processed song object
 */
function createSong(
	parsedData: ParsedSongData,
	processedData?: ProcessedSongData,
) {
	const parsedDataCopy: ParsedSongData = {};
	for (const prop in defaultParsedData) {
		const typedProp = prop as keyof ParsedSongData;
		// eslint-disable-next-line
		parsedDataCopy[typedProp] = // @ts-expect-error - it doesnt like this
			parsedData[typedProp] || defaultParsedData[typedProp];
	}

	const song = new Song(parsedDataCopy as State, DUMMY_CONNECTOR);

	if (processedData) {
		for (const field in processedData) {
			const typedField = field as keyof ProcessedSongData;
			// @ts-expect-error - it doesnt like this
			song.processed[typedField] = processedData[typedField];
		}
	}

	return song;
}

/**
 * Test if song getters return parsed values.
 */
function testParsedFields() {
	const song = createSong(PARSED_DATA);
	const valuesMap = {
		artist: song.getArtist(),
		track: song.getTrack(),
		album: song.getAlbum(),
		originUrl: song.getOriginUrl(),
		albumArtist: song.getAlbumArtist(),
	};

	for (const key in valuesMap) {
		const typedKey = key as keyof typeof valuesMap;
		const expectedValue = PARSED_DATA[typedKey];
		const actualValue = valuesMap[typedKey];

		it(`should return parsed ${key} value`, () => {
			expect(expectedValue).to.be.equal(actualValue);
		});
	}
}

/**
 * Test if song getters return processed values.
 */
function testProcessedFields() {
	const song = createSong(PARSED_DATA, PROCESSED_DATA);
	const valuesMap = {
		albumArtist: song.getAlbumArtist(),
		artist: song.getArtist(),
		track: song.getTrack(),
		album: song.getAlbum(),
	};

	for (const key in valuesMap) {
		const typedKey = key as keyof typeof valuesMap;
		const expectedValue = PROCESSED_DATA[typedKey];
		const actualValue = valuesMap[typedKey];

		it(`should return processed ${key} value`, () => {
			expect(expectedValue).to.be.equal(actualValue);
		});
	}
}

function testGetDuration() {
	const parsedDuration = 100;
	const processedDuration = 200;

	it('should return processed duration if no parsed duration', () => {
		const song = createSong({}, { duration: processedDuration });
		expect(song.getDuration()).equals(processedDuration);
	});

	it('should return parsed duration if no processed duration', () => {
		const song = createSong(
			{ duration: parsedDuration },
			{ duration: processedDuration },
		);
		expect(song.getDuration()).equals(parsedDuration);
	});

	it('should return parsed duration if processed duration available', () => {
		const song = createSong({ duration: parsedDuration }, {});
		expect(song.getDuration()).equals(parsedDuration);
	});
}

function testGetTrackArt() {
	const parsedTrackArt = 'parsed';
	const processedTrackArt = 'processed';

	const song1 = createSong({ trackArt: parsedTrackArt });
	const song2 = createSong({});

	it('should return parsed track art', () => {
		expect(song1.getTrackArt()).equals(parsedTrackArt);
	});

	it('should return null if track art is missing', () => {
		expect(song2.getTrackArt()).to.be.null;
	});

	it('should return parsed track art if processed track art exists', () => {
		const song = createSong({ trackArt: parsedTrackArt });
		song.metadata.trackArtUrl = processedTrackArt;
		expect(song.getTrackArt()).equals(parsedTrackArt);
	});

	it('should return processed track art if parsed track art is missing', () => {
		const song = createSong({});
		song.metadata.trackArtUrl = processedTrackArt;
		expect(song.getTrackArt()).equals(processedTrackArt);
	});
}

function testStaticFields() {
	it('should be an array', () => {
		expect(Song.BASE_FIELDS).to.be.an('array').that.is.not.empty;
	});

	it('should be an array', () => {
		expect(Song.USER_FIELDS).to.be.an('array').that.is.not.empty;
	});
}

function testIsValid() {
	it('should be not valid by default', () => {
		const song = createSong({});
		expect(song.isValid()).to.be.false;
	});

	it('should be valid if it is corrected', () => {
		const song = createSong({});
		song.flags.isCorrectedByUser = true;
		expect(song.isValid()).to.be.true;
	});

	it('should be valid if it is marked as valid', () => {
		const song = createSong({});
		song.flags.isValid = true;
		expect(song.isValid()).to.be.true;
	});
}

function testToString() {
	it('should be not valid by default', () => {
		const song = createSong({});
		expect(song.toString()).to.be.a('string');
	});
}

function testSetLoveStatus() {
	it('should return true if `setLoveStatus` called with true', () => {
		const song = createSong({});
		song.setLoveStatus(true);

		expect(song.metadata.userloved).to.be.true;
	});

	it('should return false if one of services set it to false', () => {
		const song = createSong({});
		song.setLoveStatus(true);
		song.setLoveStatus(false);

		expect(song.metadata.userloved).to.be.false;
	});

	it('should return false if one of services set it to false', () => {
		const song = createSong({});
		song.setLoveStatus(false);
		song.setLoveStatus(true);

		expect(song.metadata.userloved).to.be.false;
	});

	it('should return proper value if `force` param is used', () => {
		const song = createSong({});
		song.setLoveStatus(false);
		song.setLoveStatus(true, true);

		expect(song.metadata.userloved).to.be.true;
	});
}

function testResetData() {
	it('should reset flags and metadata', () => {
		const song = createSong({});

		song.flags.isCorrectedByUser = true;
		song.metadata.notificationId = '123';

		expect(song.flags.isCorrectedByUser).to.be.true;
		expect(song.metadata.notificationId).equals('123');

		song.resetData();

		expect(song.flags.isCorrectedByUser).to.be.false;
		expect(song.metadata.notificationId).to.be.undefined;
	});
}

function testResetInfo() {
	const song = createSong(PARSED_DATA, PROCESSED_DATA);
	song.resetInfo();

	const valuesMap = {
		albumArtist: song.getAlbumArtist(),
		artist: song.getArtist(),
		track: song.getTrack(),
		album: song.getAlbum(),
	};

	for (const key in valuesMap) {
		const typedKey = key as keyof typeof valuesMap;
		const expectedValue = PARSED_DATA[typedKey];
		const actualValue = valuesMap[typedKey];

		it(`should return processed ${key} value`, () => {
			expect(expectedValue).to.be.equal(actualValue);
		});
	}
}

function testGetCloneableData() {
	it('should return a copy of song', () => {
		const song = createSong(PARSED_DATA, PROCESSED_DATA);

		song.setLoveStatus(true);
		song.flags.isCorrectedByUser = true;

		const copy = song.getCloneableData();
		for (const field of ['parsed', 'processed', 'flags', 'metadata']) {
			const typedField = field as
				| 'parsed'
				| 'processed'
				| 'flags'
				| 'metadata';
			expect(copy[typedField]).to.be.deep.equal(song[typedField]);
		}
	});
}

function testEquals() {
	const songWithUniqueId = createSong({
		artist: 'Artist',
		track: 'Title',
		album: 'Album',
		uniqueID: 'uniqueId1',
	});
	const songWithNoUniqueId = createSong({
		artist: 'Artist',
		track: 'Title',
		album: 'Album',
	});

	it('should equal itself if unique ID is available', () => {
		expect(songWithUniqueId.equals(songWithUniqueId)).to.be.true;
	});

	it('should equal itself if unique ID is not available', () => {
		expect(songWithNoUniqueId.equals(songWithNoUniqueId)).to.be.true;
	});

	it('should equal another song with the same uniqueId', () => {
		const sameSong = createSong({
			artist: 'Artist',
			track: 'Title',
			album: 'Album',
			uniqueID: 'uniqueId1',
		});
		expect(songWithUniqueId.equals(sameSong)).to.be.true;
	});

	it('should equal another song with the same info', () => {
		const sameSong = createSong({
			artist: 'Artist',
			track: 'Title',
			album: 'Album',
		});
		expect(songWithNoUniqueId.equals(sameSong)).to.be.true;
	});

	it('should not equal song with no unique ID', () => {
		const differentSong = createSong({
			artist: 'Artist',
			track: 'Title',
			album: 'Album',
		});
		expect(songWithUniqueId.equals(differentSong)).to.be.false;
	});

	it('should not equal song with the different uniqueId', () => {
		const differentSong = createSong({
			artist: 'Artist',
			track: 'Title',
			album: 'Album',
			uniqueID: 'uniqueId2',
		});
		expect(songWithUniqueId.equals(differentSong)).to.be.false;
	});

	it('should equal another song with the different info', () => {
		const differentSong = createSong({
			artist: 'Artist 2',
			track: 'Title 2',
			album: 'Album 2',
		});
		expect(songWithNoUniqueId.equals(differentSong)).to.be.false;
	});

	it('should not equal null value', () => {
		// @ts-expect-error we are explicitly testing bad format here
		expect(songWithUniqueId.equals(null)).to.be.false;
	});

	it('should not equal non-song object', () => {
		// @ts-expect-error we are explicitly testing bad format here
		expect(songWithUniqueId.equals(23)).to.be.false;
	});
}

/**
 * Test 'Song.isEmpty' function.
 */
function testIsEmpty() {
	it('should return true if song has no metadata', () => {
		const songs = [
			createSong({ artist: 'Artist', track: null }),
			createSong({ artist: null, track: 'Track' }),
			createSong({ artist: null, track: null }),
		];

		for (const song of songs) {
			expect(song.isEmpty()).to.be.true;
		}
	});

	it('should return false if song has metadata', () => {
		const song = createSong(PARSED_DATA);
		expect(song.isEmpty()).to.be.false;
	});
}

function testGetUniqueId() {
	it('should return unique ID if song has parsed unique ID', () => {
		const uniqueId = 'unique';
		const song = createSong({
			artist: 'Artist',
			track: 'Title',
			album: 'Album',
			uniqueID: uniqueId,
		});
		expect(song.getUniqueId()).to.be.equal(uniqueId);
	});

	it('should not return unique ID if song has no parsed unique ID', () => {
		const song = createSong({
			artist: 'Artist',
			track: 'Title',
			album: 'Album',
		});
		expect(song.getUniqueId()).to.be.null;
	});

	it('should not return unique ID if song is empty', () => {
		const song = createSong({});
		expect(song.getUniqueId()).to.be.null;
	});
}

function testGetArtistTrackString() {
	it('should return `Artist - Track` string if song has metadata', () => {
		const song = createSong({ artist: 'Artist', track: 'Track' });
		expect(song.getArtistTrackString()).to.be.equal('Artist — Track');
	});
	it('should return null value if song is empty', () => {
		const song = createSong({ artist: null, track: null });
		expect(song.getArtistTrackString()).to.be.null;
	});
}

/**
 * Run all tests.
 */
function runTests() {
	describe('parsedData', testParsedFields);
	describe('processedData', testProcessedFields);
	describe('static fields', testStaticFields);

	describe('equals', testEquals);
	describe('isValid', testIsValid);
	describe('isEmpty', testIsEmpty);
	describe('toString', testToString);
	describe('resetData', testResetData);
	describe('resetInfo', testResetInfo);
	describe('getUniqueId', testGetUniqueId);
	describe('getTrackArt', testGetTrackArt);
	describe('getDuration', testGetDuration);
	describe('setLoveStatus', testSetLoveStatus);
	describe('getCloneableData', testGetCloneableData);
	describe('getArtistTrackString', testGetArtistTrackString);
}

runTests();
