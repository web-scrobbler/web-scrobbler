/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { expect } from 'chai';

import { getTestName } from '#/helpers/util';

import {
	Song,
	ParsedSongInfo,
	ProcessedSongInfo,
} from '@/background/object/song';

/**
 * Object that contains source data for Song object.
 */
const parsedInfo: ParsedSongInfo = {
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
const processedInfo: ProcessedSongInfo = {
	artist: 'Processed Artist',
	track: 'Processed Track',
	album: 'Processed duration',
	albumArtist: 'Processed AlbumArtist',
	duration: 321,
};

const emptyParsedInfo: ParsedSongInfo = { artist: null, track: null };

/**
 * Create a song object.
 *
 * @param parsedData Object contains custom parsed data values
 * @param [processedData] Object contains custom processed data values
 *
 * @return Song object
 */
function createSong(
	parsedData: ParsedSongInfo,
	processedData?: ProcessedSongInfo
): Song {
	const song = new Song(parsedData);

	if (processedData) {
		song.processed = processedData;
	}

	return song;
}

/**
 * Test if song getters return parsed values.
 */
function testParsedFields(): void {
	const song = createSong(parsedInfo);
	const valuesMap: ParsedSongInfo = {
		artist: song.getArtist(),
		track: song.getTrack(),
		album: song.getAlbum(),
		originUrl: song.getOriginUrl(),
		albumArtist: song.getAlbumArtist(),
	};

	for (const key in valuesMap) {
		const expectedValue = parsedInfo[key];
		const actualValue = valuesMap[key];

		it(`should return parsed ${key} value`, () => {
			expect(expectedValue).to.be.equal(actualValue);
		});
	}
}

/**
 * Test if song getters return processed values.
 */
function testProcessedFields(): void {
	const song = createSong(parsedInfo, processedInfo);
	const valuesMap: ProcessedSongInfo = {
		albumArtist: song.getAlbumArtist(),
		artist: song.getArtist(),
		track: song.getTrack(),
		album: song.getAlbum(),
	};

	for (const key in valuesMap) {
		const expectedValue = processedInfo[key];
		const actualValue = valuesMap[key];

		it(`should return processed ${key} value`, () => {
			expect(expectedValue).to.be.equal(actualValue);
		});
	}
}

/**
 * Test if a Song class has static fields.
 */
function testStaticFields() {
	it('should be an array', () => {
		expect(Song.BASE_FIELDS).to.be.an('array').that.is.not.empty;
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
		expect(songWithUniqueId.equals(null)).to.be.false;
	});

	it('should not equal non-song object', () => {
		expect(songWithUniqueId.equals(23)).to.be.false;
	});
}

function testGetArtistTrackString() {
	it('should return `Artist - Track` string if song has metadata', () => {
		const song = createSong({ artist: 'Artist', track: 'Track' });
		expect(song.getArtistTrackString()).to.be.equal('Artist — Track');
	});
	it('should return null value if song is empty', () => {
		const song = createSong(emptyParsedInfo);
		expect(song.getArtistTrackString()).to.be.null;
	});
}

function testGetCloneableData() {
	it('should return a copy of song', () => {
		const song = createSong(parsedInfo, processedInfo);

		song.setLoveStatus(true);
		song.flags.isCorrectedByUser = true;

		const copy = song.getCloneableData();
		for (const field of ['parsed', 'processed', 'flags', 'metadata']) {
			expect(copy[field]).to.be.deep.equal(song[field]);
		}
	});
}

function testGetDuration() {
	const parsedDuration = 100;
	const processedDuration = 200;

	it('should return processed duration if no parsed duration', () => {
		const song = createSong(emptyParsedInfo, {
			...emptyParsedInfo,
			duration: processedDuration,
		});
		expect(song.getDuration()).equals(processedDuration);
	});

	it('should return parsed duration if no processed duration', () => {
		const song = createSong(
			{ ...emptyParsedInfo, duration: parsedDuration },
			{ ...emptyParsedInfo, duration: processedDuration }
		);
		expect(song.getDuration()).equals(parsedDuration);
	});

	it('should return parsed duration if processed duration available', () => {
		const song = createSong({
			...emptyParsedInfo,
			duration: parsedDuration,
		});
		expect(song.getDuration()).equals(parsedDuration);
	});
}

function testGetInfo() {
	it('should return song info', () => {
		const song = createSong(parsedInfo);
		const songInfo = song.getInfo();

		expect(songInfo).to.be.an('object');
	});
}

function testGetTrackArt() {
	const parsedTrackArt = 'parsed';
	const processedTrackArt = 'processed';

	const song1 = createSong({ ...emptyParsedInfo, trackArt: parsedTrackArt });
	const song2 = createSong(emptyParsedInfo);

	it('should return parsed track art', () => {
		expect(song1.getTrackArt()).equals(parsedTrackArt);
	});

	it('should return null if track art is missing', () => {
		expect(song2.getTrackArt()).to.be.null;
	});

	it('should return parsed track art if processed track art exists', () => {
		const song = createSong({
			...emptyParsedInfo,
			trackArt: parsedTrackArt,
		});
		song.metadata.trackArtUrl = processedTrackArt;
		expect(song.getTrackArt()).equals(parsedTrackArt);
	});

	it('should return processed track art if parsed track art is missing', () => {
		const song = createSong(emptyParsedInfo);
		song.metadata.trackArtUrl = processedTrackArt;
		expect(song.getTrackArt()).equals(processedTrackArt);
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
}

function testIsEmpty() {
	it('should return true if song has no metadata', () => {
		const songs = [
			createSong({ artist: 'Artist', track: null }),
			createSong({ artist: null, track: 'Track' }),
			createSong(emptyParsedInfo),
		];

		for (const song of songs) {
			expect(song.isEmpty()).to.be.true;
		}
	});

	it('should return false if song has metadata', () => {
		const song = createSong(parsedInfo);
		expect(song.isEmpty()).to.be.false;
	});
}

function testIsValid() {
	it('should be not valid by default', () => {
		const song = createSong(emptyParsedInfo);
		expect(song.isValid()).to.be.false;
	});

	it('should be valid if it is corrected', () => {
		const song = createSong(emptyParsedInfo);
		song.flags.isCorrectedByUser = true;
		expect(song.isValid()).to.be.true;
	});

	it('should be valid if it is marked as valid', () => {
		const song = createSong(emptyParsedInfo);
		song.flags.isValid = true;
		expect(song.isValid()).to.be.true;
	});
}

function testResetData() {
	it('should reset flags and metadata', () => {
		const song = createSong(emptyParsedInfo);

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
	const song = createSong(parsedInfo, processedInfo);
	song.resetInfo();

	const valuesMap = {
		albumArtist: song.getAlbumArtist(),
		artist: song.getArtist(),
		track: song.getTrack(),
		album: song.getAlbum(),
	};

	for (const key in valuesMap) {
		const expectedValue = parsedInfo[key];
		const actualValue = valuesMap[key];

		it(`should return parsed ${key} value after reset`, () => {
			expect(expectedValue).to.be.equal(actualValue);
		});
	}
}

function testSetLoveStatus() {
	it('should return true if `setLoveStatus` called with true', () => {
		const song = createSong(emptyParsedInfo);
		song.setLoveStatus(true);

		expect(song.metadata.userloved).to.be.true;
	});

	it('should return false if one of services set it to false', () => {
		const song = createSong(emptyParsedInfo);
		song.setLoveStatus(true);
		song.setLoveStatus(false);

		expect(song.metadata.userloved).to.be.false;
	});

	it('should return false if one of services set it to false', () => {
		const song = createSong(emptyParsedInfo);
		song.setLoveStatus(false);
		song.setLoveStatus(true);

		expect(song.metadata.userloved).to.be.false;
	});

	it('should return proper value if `force` param is used', () => {
		const song = createSong(emptyParsedInfo);
		song.setLoveStatus(false);
		song.setLoveStatus(true, { force: true });

		expect(song.metadata.userloved).to.be.true;
	});
}

function testToString() {
	it('should be not valid by default', () => {
		const song = createSong(emptyParsedInfo);
		expect(song.toString()).to.be.a('string');
	});
}

function testWrap() {
	it('should wrap cloned data properly', () => {
		const song = createSong(parsedInfo, processedInfo);
		const wrappedSong = Song.wrap(song.getCloneableData());

		expect(song).to.be.deep.equal(wrappedSong);
	});
}

describe(getTestName(__filename), () => {
	describe('static fields', testStaticFields);
	describe('parsed song info', testParsedFields);
	describe('processed song info', testProcessedFields);

	describe('equals', testEquals);
	describe('getArtistTrackString', testGetArtistTrackString);
	describe('getCloneableData', testGetCloneableData);
	describe('getDuration', testGetDuration);
	describe('getInfo', testGetInfo);
	describe('getTrackArt', testGetTrackArt);
	describe('getUniqueId', testGetUniqueId);
	describe('isEmpty', testIsEmpty);
	describe('isValid', testIsValid);
	describe('resetData', testResetData);
	describe('resetInfo', testResetInfo);
	describe('setLoveStatus', testSetLoveStatus);
	describe('toString', testToString);
	describe('wrap', testWrap);
});
