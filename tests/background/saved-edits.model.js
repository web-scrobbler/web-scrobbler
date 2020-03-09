'use strict';

const expect = require('chai').expect;

const Song = require('../../src/core/background/object/song');
const SavedEditsModel = require('../../src/core/background/storage/saved-edits.model');

const dummyConnector = {
	label: 'Dummy label'
};

class SavedEditsImpl extends SavedEditsModel {
	constructor() {
		super();

		this.songInfoStorage = {};
		this.artistAlbumStorage = {};
	}

	/** @override */
	async getSongInfoStorage() {
		return this.songInfoStorage;
	}

	/** @override */
	async getArtistAlbumStorage() {
		return this.artistAlbumStorage;
	}

	/** @override */
	async saveSongInfoToStorage(data) {
		this.songInfoStorage = data;
	}

	/** @override */
	async saveArtistAlbumToStorage(data) {
		this.artistAlbumStorage = data;
	}
}

/**
 * Run all tests.
 */
function runTests() {
	const modelImpl = new SavedEditsImpl();
	const processedSong = makeProcessedSong();
	const unprocessedSong1 = makeNoProcessedSong1();
	const unprocessedSong2 = makeNoProcessedSong2();
	const unprocessedSong3 = makeNoProcessedSong3();
	const editedInfo = makeEditedInfo();

	it('should return false for song #1', () => {
		return modelImpl.loadSongInfo(unprocessedSong1).then((isLoaded) => {
			expect(isLoaded).to.be.false;
		});
	});

	it('should save edited info of song #1', () => {
		return modelImpl.saveSongInfo(unprocessedSong1, editedInfo);
	});

	it('should load edited info of song #1', () => {
		return modelImpl.loadSongInfo(unprocessedSong1).then((isLoaded) => {
			const { artist, album, track } = unprocessedSong1.processed;
			const loadedInfo = { artist, album, track };

			expect(isLoaded).to.be.true;
			expect(loadedInfo).to.be.deep.equal(editedInfo);
		});
	});

	it('should load edited artist and album for song #2', () => {
		return modelImpl.loadSongInfo(unprocessedSong2).then((isLoaded) => {
			const { artist, album } = unprocessedSong2.processed;

			expect(isLoaded).to.be.true;
			expect(unprocessedSong2.getArtist()).to.be.equal(artist);
			expect(unprocessedSong2.getAlbum()).to.be.equal(album);
		});
	});

	it('should not load edited artist and album for song #3', () => {
		return modelImpl.loadSongInfo(unprocessedSong3).then((isLoaded) => {
			expect(isLoaded).to.be.false;
		});
	});

	it('should load edited artist and album for processed song', () => {
		return modelImpl.loadSongInfo(processedSong).then((isLoaded) => {
			const { artist, album } = processedSong.processed;

			expect(isLoaded).to.be.true;
			expect(processedSong.getArtist()).to.be.equal(artist);
			expect(processedSong.getAlbum()).to.be.equal(album);
		});
	});
}

function makeNoProcessedSong1() {
	const parsed = {
		artist: 'Artist',
		track: 'Track 1',
		album: 'Album',
	};
	return new Song(parsed, dummyConnector);
}

function makeNoProcessedSong2() {
	const parsed = {
		artist: 'Artist',
		track: 'Track 2',
		album: 'Album',
	};
	return new Song(parsed, dummyConnector);
}

function makeNoProcessedSong3() {
	const parsed = {
		artist: 'Artist 2',
		track: 'Track 2',
		album: 'Album 2',
	};
	return new Song(parsed, dummyConnector);
}

function makeProcessedSong() {
	const parsed = {
		artist: 'Artist',
		track: 'Track 3',
		album: 'Album',
	};
	const processed = {
		artist: 'ArtistProcessed',
		track: 'TrackProcessed 3',
		album: 'AlbumProcessed',
	};

	const song = new Song(parsed, dummyConnector);
	for (const key in processed) {
		song.processed[key] = processed[key];
	}

	return song;
}

function makeEditedInfo() {
	return {
		artist: 'ArtistEdited', album: 'AlbumEdited', track: 'TrackEdited'
	};
}

runTests();
