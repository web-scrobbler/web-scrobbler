import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { MockedStorage } from '#/mock/MockedStorage';
import { getTestName } from '#/helpers/util';

import { Song, EditedSongInfo } from '@/background/object/song';

import { EditedTracks } from '@/background/repository/edited-tracks/EditedTracks';
import { EditedTracksImpl } from '@/background/repository/edited-tracks/EditedTracksImpl';

chai.use(chaiAsPromised);

function testEmptySong() {
	const editedTracks = createEditedTracks();
	const emptySong = makeNonProcessedSong(null, null);

	it('should throw an error while getting info of an empty song', () => {
		const promise = editedTracks.getSongInfo(emptySong);
		return expect(promise).to.eventually.rejected;
	});

	it('should throw an error while saving edited info for an empty song', () => {
		const editedInfo = {
			artist: 'ArtistEdited',
			album: 'AlbumEdited',
			track: 'TrackEdited',
		};

		const promise = editedTracks.setSongInfo(emptySong, editedInfo);
		return expect(promise).to.eventually.rejected;
	});
}

function testClearStorage() {
	const song = makeNonProcessedSong('Artist', 'Track', 'Album');
	const editedTracks = createEditedTracks(song);

	it('should clear edited tracks', async () => {
		await editedTracks.clear();

		return expectSongInfoNotLoaded(editedTracks.getSongInfo(song));
	});
}

function testLoadNoSavedSong() {
	const editedTracks = createEditedTracks();
	const notSavedSong = makeNonProcessedSong('Artist', 'Track', 'Album');

	it('should not load not saved song', () => {
		return expectSongInfoNotLoaded(editedTracks.getSongInfo(notSavedSong));
	});
}

function testRemoveSongInfo() {
	const song = makeNonProcessedSong('Artist', 'Track', 'Album');
	const editedTracks = createEditedTracks(song);

	it('should remove saved song', () => {
		return editedTracks.deleteSongInfo(song);
	});

	it('should not load removed song', () => {
		return expectSongInfoNotLoaded(editedTracks.getSongInfo(song));
	});
}

function testSaveLoadSongWithoutId() {
	const editedInfo = {
		artist: 'Artist',
		album: 'Album',
		track: 'Track',
	};
	const songWithoutId = makeNonProcessedSong('Artist', 'Track', 'Album');
	const editedTracks = createEditedTracks(songWithoutId);

	it('should load edited info of song with no unique ID', () => {
		return expectSongInfoLoaded(
			editedTracks.getSongInfo(songWithoutId),
			editedInfo
		);
	});
}

function testSaveLoadSongWithId() {
	const editedInfo = {
		artist: 'Artist',
		track: 'Track',
		album: 'Album',
	};
	const songWithUniqueId = makeNonProcessedSong(
		'Artist',
		'Track',
		'Album',
		'uniqueId'
	);
	const editedTracks = createEditedTracks(songWithUniqueId);

	it('should get edited info of song with unique ID', () => {
		return expectSongInfoLoaded(
			editedTracks.getSongInfo(songWithUniqueId),
			editedInfo
		);
	});
}

function testSaveOverwriteSong() {
	const song = makeNonProcessedSong('Artist', 'Track', 'Album');
	const editedTracks = createEditedTracks(song);

	const editedInfo = {
		artist: 'ArtistEdited',
		track: 'TrackEdited',
		album: 'AlbumEdited',
	};

	it('should save edited info of song with no album', async () => {
		await editedTracks.setSongInfo(song, editedInfo);

		await expectSongInfoLoaded(editedTracks.getSongInfo(song), editedInfo);
	});
}

function testSaveLoadSongFallback() {
	const editedInfo = {
		artist: 'Artist',
		track: 'Track',
	};
	const songWithoutAlbum = makeNonProcessedSong('Artist', 'Track');
	const songWithAlbum = makeNonProcessedSong('Artist', 'Track', 'Album');

	const editedTracks = createEditedTracks(songWithoutAlbum);

	it('should load edited info of song with album', () => {
		return expectSongInfoLoaded(
			editedTracks.getSongInfo(songWithAlbum),
			editedInfo
		);
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
	task: Promise<EditedSongInfo>,
	editedInfo: EditedSongInfo
) {
	return expect(task).to.be.eventually.deep.equal(editedInfo);
}

async function expectSongInfoNotLoaded(task: Promise<EditedSongInfo>) {
	return expect(task).to.eventually.be.null;
}

function createEditedTracks(...initialData: Song[]): EditedTracks {
	const editedTracks = new EditedTracksImpl(new MockedStorage());

	for (const song of initialData) {
		const editedInfo: EditedSongInfo = {
			artist: song.getArtist(),
			track: song.getTrack(),
			album: song.getAlbum(),
			albumArtist: song.getAlbumArtist(),
		};

		editedTracks.setSongInfo(song, editedInfo);
	}

	return editedTracks;
}

describe(getTestName(__filename), () => {
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
