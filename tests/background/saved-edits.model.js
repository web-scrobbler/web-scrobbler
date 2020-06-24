'use strict';

const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-as-promised'));

const rootSrc = '../../src/';

const Song = require(`${rootSrc}/core/background/object/song`);
const SavedEditsModel = require(`${rootSrc}/core/background/storage/saved-edits.model`);

const { makeStorageWrapperStub } = require('../helpers');

const connectorStub = {
	label: 'Dummy label',
};

/**
 * Run all tests.
 */
function runTests() {
	describe('should throw an error for empty songs', testSaveEmptySong);

	describe('clear storage', testClearStorage);
	describe('should not load not a song', testLoadNoSavedSong);
	describe('should remove song from storage', testRemoveSongInfo);
	describe('should overwrite edited song info', testSaveOverwriteSong);
	describe(
		'should save and load a song with unique ID',
		testSaveLoadSongWithId
	);
	describe(
		'should save and load a song with no unique ID',
		testSaveLoadSongWithNoId
	);
	describe(
		'should save and load a song (with fallback)',
		testSaveLoadSongFallback
	);
}

function testSaveEmptySong() {
	const savedEdits = makeEmptySavedEdits();
	const emptySong = makeNonProcessedSong();

	it('should throw an error while loading info of an empty song', () => {
		const promise = savedEdits.loadSongInfo(emptySong);
		return expect(promise).to.be.eventually.rejected;
	});

	it('should throw an error while saving an empty song', () => {
		const editedInfo = {
			artist: 'ArtistEdited',
			album: 'AlbumEdited',
			track: 'TrackEdited',
		};

		const promise = savedEdits.saveSongInfo(emptySong, editedInfo);
		return expect(promise).to.be.eventually.rejected;
	});
}

function testClearStorage() {
	const song = makeNonProcessedSong('Artist', 'Track', 'Album');
	const savedEdits = makeSavedEdits(song);

	it('should clear storage', () => {
		return savedEdits.clear();
	});

	it('should not load song', () => {
		return expectSongInfoNotLoaded(savedEdits, song);
	});
}

function testLoadNoSavedSong() {
	const savedEdits = makeEmptySavedEdits();

	const song = makeNonProcessedSong('Artist', 'Track', 'Album');

	it('should not load not saved song', () => {
		return savedEdits.loadSongInfo(song).then((isLoaded) => {
			expect(isLoaded).to.be.false;
		});
	});
}

function testSaveLoadSongWithNoId() {
	const savedEdits = makeEmptySavedEdits();

	const editedInfo = {
		artist: 'ArtistEdited',
		album: 'AlbumEdited',
		track: 'TrackEdited',
	};
	const songWithNoId = makeNonProcessedSong('Artist', 'Track', 'Album');

	it('should return false for song with no unique ID', () => {
		return expectSongInfoNotLoaded(savedEdits, songWithNoId);
	});

	it('should save edited info of song with no unique ID', () => {
		return savedEdits.saveSongInfo(songWithNoId, editedInfo);
	});

	it('should load edited info of song with no unique ID', () => {
		return expectSongInfoLoaded(savedEdits, songWithNoId, editedInfo);
	});
}

function testSaveLoadSongWithId() {
	const savedEdits = makeEmptySavedEdits();
	const editedInfo = {
		artist: 'ArtistEdited',
		album: 'AlbumEdited',
		track: 'TrackEdited',
	};
	const songWitId = makeNonProcessedSong(
		'Artist',
		'Track',
		'Album',
		'uniqueId'
	);

	it('should return false for song with unique ID', () => {
		return expectSongInfoNotLoaded(savedEdits, songWitId);
	});

	it('should save edited info of song with unique ID', () => {
		return savedEdits.saveSongInfo(songWitId, editedInfo);
	});

	it('should load edited info of song with unique ID', () => {
		return expectSongInfoLoaded(savedEdits, songWitId, editedInfo);
	});
}

function testSaveOverwriteSong() {
	const savedEdits = makeEmptySavedEdits();

	const editedInfo1 = {
		artist: 'ArtistEdited1',
		album: 'AlbumEdited1',
		track: 'TrackEdited1',
	};
	const editedInfo2 = {
		artist: 'ArtistEdited2',
		album: 'AlbumEdited2',
		track: 'TrackEdited2',
	};
	const song = makeNonProcessedSong('Artist', 'Track', 'Album');

	it('should save edited info of song with no album', async () => {
		await savedEdits.saveSongInfo(song, editedInfo1);
		await savedEdits.saveSongInfo(song, editedInfo2);

		await expectSongInfoLoaded(savedEdits, song, editedInfo2);
	});
}

function testSaveLoadSongFallback() {
	const savedEdits = makeEmptySavedEdits();

	const editedInfo = {
		artist: 'ArtistEdited',
		album: 'AlbumEdited',
		track: 'TrackEdited',
	};
	const songWithNoAlbum = makeNonProcessedSong('Artist', 'Track');
	const songWithAlbum = makeNonProcessedSong('Artist', 'Track', 'Album');

	it('should save edited info of song with no album', () => {
		return savedEdits.saveSongInfo(songWithNoAlbum, editedInfo);
	});

	it('should load edited info of song with no album', () => {
		return expectSongInfoLoaded(savedEdits, songWithNoAlbum, editedInfo);
	});

	it('should load edited info of song with album', () => {
		return expectSongInfoLoaded(savedEdits, songWithAlbum, editedInfo);
	});
}

function testRemoveSongInfo() {
	const song = makeNonProcessedSong('Artist', 'Track', 'Album');
	const savedEdits = makeSavedEdits(song);

	it('should remove saved song', () => {
		return savedEdits.removeSongInfo(song);
	});

	it('should not load removed song', () => {
		return expectSongInfoNotLoaded(savedEdits, song);
	});
}

function makeNonProcessedSong(artist, track, album, uniqueID) {
	return new Song({ artist, track, album, uniqueID }, connectorStub);
}

async function expectSongInfoLoaded(model, song, editedInfo) {
	const isLoaded = await model.loadSongInfo(song);

	const { artist, album, track } = song.processed;
	const loadedInfo = { artist, album, track };

	expect(isLoaded).to.be.true;
	expect(loadedInfo).to.be.deep.equal(editedInfo);
}

async function expectSongInfoNotLoaded(model, song) {
	return expect(model.loadSongInfo(song)).to.be.eventually.be.false;
}

function makeEmptySavedEdits() {
	return new SavedEditsMockImpl();
}

function makeSavedEdits(...songs) {
	const savedEdits = new SavedEditsMockImpl();
	for (const song of songs) {
		savedEdits.saveData(song);
	}
	return savedEdits;
}

class SavedEditsMockImpl extends SavedEditsModel {
	/** @override */
	getStorage() {
		return makeStorageWrapperStub();
	}

	/** @override */
	showDebugLog() {
		// Do nothing
	}
}

runTests();
