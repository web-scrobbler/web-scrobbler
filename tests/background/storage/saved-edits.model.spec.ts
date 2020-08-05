import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';

import { makeStorageWrapperStub } from '#/helpers/create-stubs';
import { getTestName } from '#/helpers/util';

import { Song, EditedSongInfo } from '@/background/object/song';
import { SavedEditsModel } from '@/background/storage/saved-edits.model';

chai.use(chaiAsPromised);

function testSaveEmptySong() {
	const savedEdits = makeEmptySavedEdits();
	const emptySong = makeNonProcessedSong(null, null);

	it('should throw an error while loading info of an empty song', () => {
		const promise = savedEdits.loadSongInfo(emptySong);
		return expect(promise).to.eventually.rejected;
	});

	it('should throw an error while saving an empty song', () => {
		const editedInfo = {
			artist: 'ArtistEdited',
			album: 'AlbumEdited',
			track: 'TrackEdited',
		};

		const promise = savedEdits.saveSongInfo(emptySong, editedInfo);

		return expect(promise).to.eventually.rejected;
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

	const notSavedSong = makeNonProcessedSong('Artist', 'Track', 'Album');

	it('should not load not saved song', () => {
		return expectSongInfoNotLoaded(savedEdits, notSavedSong);
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

function makeNonProcessedSong(
	artist: string,
	track: string,
	album?: string,
	uniqueID?: string
) {
	return new Song({ artist, track, album, uniqueID });
}

async function expectSongInfoLoaded(
	model: SavedEditsModel,
	song: Song,
	editedInfo: EditedSongInfo
) {
	const actualInfo = await model.loadSongInfo(song);

	expect(actualInfo).to.be.deep.equal(editedInfo);
}

async function expectSongInfoNotLoaded(model: SavedEditsModel, song: Song) {
	return expect(model.loadSongInfo(song)).to.eventually.be.null;
}

function makeEmptySavedEdits() {
	return new SavedEditsMockImpl();
}

function makeSavedEdits(...songs: Song[]) {
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

describe(getTestName(__filename), () => {
	describe('should throw an error for empty songs', testSaveEmptySong);
	describe('should clear storage', testClearStorage);
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
});
