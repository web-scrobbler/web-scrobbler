import { expect, describe, it, beforeAll } from 'vitest';

import webextensionPolyfill from '#/mocks/webextension-polyfill';

import Song from '@/core/object/song';
import { getConnectorById } from '@/util/util-connector';
import { SavedEdit } from '@/core/storage/options';
import savedEdits from '@/core/storage/saved-edits';
import SavedEditsModel from '@/core/storage/saved-edits.model';

const editedInfo = {
	artist: 'ArtistEdited',
	album: 'AlbumEdited',
	track: 'TrackEdited',
	albumArtist: null,
};

const connectorStub = getConnectorById('youtube')!;
/**
 * Run all tests.
 */
function runTests() {
	beforeAll(() => {
		savedEdits.init();
	});
	describe('should throw an error for empty songs', testSaveEmptySong);

	describe('clear storage', testClearStorage);
	describe('should not load not a song', testLoadNoSavedSong);
	describe('should remove song from storage', testRemoveSongInfo);
	describe('should overwrite edited song info', testSaveOverwriteSong);
	describe(
		'should save and load a song with unique ID',
		testSaveLoadSongWithId,
	);
	describe(
		'should save and load a song with no unique ID',
		testSaveLoadSongWithNoId,
	);
	describe(
		'should save and load a song (with fallback)',
		testSaveLoadSongFallback,
	);
}

function testSaveEmptySong() {
	emptySavedEdits();
	const emptySong = makeNonProcessedSong();

	it('should throw an error while loading info of an empty song', () => {
		expect(savedEdits.loadSongInfo(emptySong)).rejects.to.deep.equal(
			new Error('Empty song'),
		);
	});

	it('should throw an error while saving an empty song', () => {
		expect(
			savedEdits.saveSongInfo(emptySong, editedInfo),
		).rejects.to.deep.equal(new Error('Empty song'));
	});
}

function testClearStorage() {
	const song = makeNonProcessedSong('Artist', 'Track', 'Album');
	const savedEdits = makeSavedEdits({
		song,
		edit: editedInfo,
	});

	it('should clear storage', () => {
		return savedEdits.clear();
	});

	it('should not load song', async () => {
		await expectSongInfoNotLoaded(savedEdits, song);
	});
}

function testLoadNoSavedSong() {
	emptySavedEdits();

	const song = makeNonProcessedSong('Artist', 'Track', 'Album');

	it('should not load not saved song', async () => {
		const songInfo = await savedEdits.loadSongInfo(song);
		expect(songInfo).to.be.false;
	});
}

function testSaveLoadSongWithNoId() {
	beforeAll(() => {
		emptySavedEdits();
	});

	const songWithNoId = makeNonProcessedSong('Artist', 'Track', 'Album');

	it('should return false for song with no unique ID', async () => {
		await expectSongInfoNotLoaded(savedEdits, songWithNoId);
	});

	it('should save edited info of song with no unique ID', () => {
		return savedEdits.saveSongInfo(songWithNoId, editedInfo);
	});

	it('should load edited info of song with no unique ID', async () => {
		await expectSongInfoLoaded(savedEdits, songWithNoId, editedInfo);
	});
}

function testSaveLoadSongWithId() {
	beforeAll(() => {
		emptySavedEdits();
	});
	const songWitId = makeNonProcessedSong(
		'Artist',
		'Track',
		'Album',
		'uniqueId',
	);

	it('should return false for song with unique ID', async () => {
		await expectSongInfoNotLoaded(savedEdits, songWitId);
	});

	it('should save edited info of song with unique ID', () => {
		return savedEdits.saveSongInfo(songWitId, editedInfo);
	});

	it('should load edited info of song with unique ID', async () => {
		await expectSongInfoLoaded(savedEdits, songWitId, editedInfo);
	});
}

function testSaveOverwriteSong() {
	emptySavedEdits();

	const editedInfo1 = {
		artist: 'ArtistEdited1',
		album: 'AlbumEdited1',
		track: 'TrackEdited1',
		albumArtist: null,
	};
	const editedInfo2 = {
		artist: 'ArtistEdited2',
		album: 'AlbumEdited2',
		track: 'TrackEdited2',
		albumArtist: null,
	};
	const song = makeNonProcessedSong('Artist', 'Track', 'Album');

	it('should save edited info of song with no album', async () => {
		await savedEdits.saveSongInfo(song, editedInfo1);
		await savedEdits.saveSongInfo(song, editedInfo2);

		await expectSongInfoLoaded(savedEdits, song, editedInfo2);
	});
}

function testSaveLoadSongFallback() {
	emptySavedEdits();

	const songWithNoAlbum = makeNonProcessedSong('Artist', 'Track');
	const songWithAlbum = makeNonProcessedSong('Artist', 'Track', 'Album');

	it('should save edited info of song with no album', () => {
		return savedEdits.saveSongInfo(songWithNoAlbum, editedInfo);
	});

	it('should load edited info of song with no album', async () => {
		await expectSongInfoLoaded(savedEdits, songWithNoAlbum, editedInfo);
	});

	it('should load edited info of song with album', async () => {
		await expectSongInfoLoaded(savedEdits, songWithAlbum, editedInfo);
	});
}

function testRemoveSongInfo() {
	const song = makeNonProcessedSong('Artist', 'Track', 'Album');
	const savedEdits = makeSavedEdits({
		song,
		edit: editedInfo,
	});

	it('should remove saved song', async () => {
		await savedEdits.removeSongInfo(song);
	});

	it('should not load removed song', async () => {
		await expectSongInfoNotLoaded(savedEdits, song);
	});
}

function makeNonProcessedSong(
	artist?: string,
	track?: string,
	album?: string,
	uniqueID?: string,
) {
	return new Song({ artist, track, album, uniqueID }, connectorStub);
}

async function expectSongInfoLoaded(
	model: SavedEditsModel,
	song: Song,
	editedInfo: SavedEdit,
) {
	const isLoaded = await model.loadSongInfo(song);

	const { artist, album, track, albumArtist } = song.processed;
	const loadedInfo = { artist, album, track, albumArtist };

	expect(isLoaded).to.be.true;
	expect(loadedInfo).to.be.deep.equal(editedInfo);
}

async function expectSongInfoNotLoaded(model: SavedEditsModel, song: Song) {
	const songInfo = await model.loadSongInfo(song);
	expect(songInfo).be.false;
}

function makeSavedEdits(
	...edits: {
		song: Song;
		edit: SavedEdit;
	}[]
) {
	webextensionPolyfill.reset();
	for (const edit of edits) {
		savedEdits.saveSongInfo(edit.song, edit.edit);
	}
	return savedEdits;
}

function emptySavedEdits() {
	webextensionPolyfill.reset();
}

runTests();
