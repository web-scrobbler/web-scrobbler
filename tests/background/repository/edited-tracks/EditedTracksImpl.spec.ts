import { expect } from 'chai';

import { MemoryStorage } from '#/stub/MemoryStorage';
import { createSongStub } from '#/stub/SongStubFactory';
import { describeModuleTest } from '#/helpers/util';

import { Song } from '@/background/model/song/Song';

import { EditedTracks } from '@/background/repository/edited-tracks/EditedTracks';
import { EditedTracksImpl } from '@/background/repository/edited-tracks/EditedTracksImpl';
import { EditedTrackInfo } from '@/background/repository/edited-tracks/EditedTrackInfo';

describeModuleTest(__filename, () => {
	describe('should throw an error for empty songs', testEmptySong);

	describe('should clear storage', testClearStorage);
	describe('should not load not saved song', testLoadNoSavedSong);
	describe('should remove song from storage', testRemoveSongInfo);

	describe(
		'should save and load a song with no unique ID',
		testSaveLoadSongWithoutId
	);
	describe(
		'should save and load a song with unique ID',
		testSaveLoadSongWithId
	);
	describe('should overwrite edited song info', testSaveOverwriteSong);
	describe(
		'should save and load a song (with fallback)',
		testSaveLoadSongFallback
	);
});

function testEmptySong() {
	const editedTracks = createEditedTracks();
	const emptySong = createSong(null, null);

	it('should throw an error while getting info of an empty song', () => {
		const promise = editedTracks.getSongInfo(emptySong.generateUniqueIds());
		return expect(promise).to.eventually.rejected;
	});

	it('should throw an error while saving edited info for an empty song', () => {
		const editedInfo = {
			artist: 'ArtistEdited',
			album: 'AlbumEdited',
			track: 'TrackEdited',
		};

		const promise = editedTracks.setSongInfo(
			emptySong.getUniqueId(),
			editedInfo
		);
		return expect(promise).to.eventually.rejected;
	});
}

function testClearStorage() {
	const song = createSong('Artist', 'Track', 'Album');
	const editedTracks = createEditedTracks(song);

	it('should clear edited tracks', async () => {
		await editedTracks.clear();

		return expectSongInfoNotLoaded(
			editedTracks.getSongInfo(song.generateUniqueIds())
		);
	});
}

function testLoadNoSavedSong() {
	const editedTracks = createEditedTracks();
	const notSavedSong = createSong('Artist', 'Track', 'Album');

	it('should not load not saved song', () => {
		return expectSongInfoNotLoaded(
			editedTracks.getSongInfo(notSavedSong.generateUniqueIds())
		);
	});
}

function testRemoveSongInfo() {
	const song = createSong('Artist', 'Track', 'Album');
	const editedTracks = createEditedTracks(song);

	it('should remove saved song', () => {
		return editedTracks.deleteSongInfo(song.getUniqueId());
	});

	it('should not load removed song', () => {
		return expectSongInfoNotLoaded(
			editedTracks.getSongInfo(song.generateUniqueIds())
		);
	});
}

function testSaveLoadSongWithoutId() {
	const expectedEditedInfo = {
		artist: 'Artist',
		album: 'Album',
		track: 'Track',
	};
	const existingSong = createSong('Artist', 'Track', 'Album');
	const editedTracks = createEditedTracks(existingSong);

	it('should load edited info of song with no unique ID', () => {
		return expectSongInfoLoaded(
			editedTracks.getSongInfo(existingSong.generateUniqueIds()),
			expectedEditedInfo
		);
	});
}

function testSaveLoadSongWithId() {
	const expectedEditedInfo = {
		artist: 'Artist',
		track: 'Track',
		album: 'Album',
	};
	const songWithUniqueId = createSong('Artist', 'Track', 'Album', 'uniqueId');
	const editedTracks = createEditedTracks(songWithUniqueId);

	it('should get edited info of song with unique ID', () => {
		return expectSongInfoLoaded(
			editedTracks.getSongInfo(songWithUniqueId.generateUniqueIds()),
			expectedEditedInfo
		);
	});
}

function testSaveOverwriteSong() {
	const existingSong = createSong('Artist', 'Track', 'Album');
	const editedTracks = createEditedTracks(existingSong);

	const editedInfo = {
		artist: 'ArtistEdited',
		track: 'TrackEdited',
		album: 'AlbumEdited',
	};

	it('should save edited info of song with no album', async () => {
		await editedTracks.setSongInfo(existingSong.getUniqueId(), editedInfo);

		await expectSongInfoLoaded(
			editedTracks.getSongInfo(existingSong.generateUniqueIds()),
			editedInfo
		);
	});
}

function testSaveLoadSongFallback() {
	const expectedEditedInfo = {
		artist: 'Artist',
		track: 'Track',
	};
	const existingSong = createSong('Artist', 'Track');
	const playingSong = createSong('Artist', 'Track', 'Album');

	const editedTracks = createEditedTracks(existingSong);

	it('should load edited info of song with album', () => {
		return expectSongInfoLoaded(
			editedTracks.getSongInfo(playingSong.generateUniqueIds()),
			expectedEditedInfo
		);
	});
}

function createSong(
	artist: string,
	track: string,
	album?: string,
	uniqueID?: string
): Song {
	return createSongStub({ artist, track, album, uniqueID });
}

async function expectSongInfoLoaded(
	task: Promise<EditedTrackInfo>,
	editedInfo: EditedTrackInfo
) {
	return expect(task).to.be.eventually.deep.equal(editedInfo);
}

async function expectSongInfoNotLoaded(task: Promise<EditedTrackInfo>) {
	return expect(task).to.eventually.be.null;
}

function createEditedTracks(...initialSongs: Song[]): EditedTracks {
	const editedTracks = new EditedTracksImpl(new MemoryStorage());

	for (const song of initialSongs) {
		const editedInfo: EditedTrackInfo = {
			artist: song.getArtist(),
			track: song.getTrack(),
			album: song.getAlbum(),
			albumArtist: song.getAlbumArtist(),
		};

		editedTracks.setSongInfo(song.getUniqueId(), editedInfo);
	}

	return editedTracks;
}
