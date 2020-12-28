import { expect } from 'chai';

import { getTestName } from '#/helpers/util';
import { createSongStub } from '#/stub/SongStubFactory';
import { createSongFromDto } from '@/background/model/song/SongFactory';
import { Song } from '@/background/model/song/Song';
import { SongDto } from '@/background/model/song/SongDto';

describe(getTestName(__filename), () => {
	describe('Song.getUniqueId', testGetUniqueId);
	describe('Song.isEmpty', testIsEmpty);
	describe('Song.serialize', testSerialize);
});

function testGetUniqueId() {
	it('should return unique ID if song has parsed unique ID', () => {
		const uniqueId = 'unique';
		const song = createSongStub({ uniqueID: uniqueId });
		expect(song.getUniqueId()).to.be.equal(uniqueId);
	});

	it('should not return unique ID if song has no parsed unique ID', () => {
		const song = createSongStub();
		expect(song.getUniqueId()).to.be.null;
	});
}

function testIsEmpty() {
	it('should return true if song has no metadata', () => {
		const songs = [
			createSongStub({ artist: 'Artist', track: null }),
			createSongStub({ artist: null, track: 'Track' }),
			createSongStub({ artist: null, track: null }),
		];

		for (const song of songs) {
			expect(song.isEmpty()).to.be.true;
		}
	});

	it('should return false if song has metadata', () => {
		const song = createSongStub();
		expect(song.isEmpty()).to.be.false;
	});
}

function testSerialize() {
	it('should serialize song correctly', () => {
		const dto = createSerializedSong();

		expect(dto.artist).to.be.equal('TestArtist');
		expect(dto.track).to.be.equal('TestTrack');
		expect(dto.album).to.be.equal('TestAlbum');
		expect(dto.albumArtist).to.be.equal('TestAlbumArtist');
		expect(dto.trackArt).to.be.equal('TestTrackArt');
		expect(dto.currentTime).to.be.equal(10);
		expect(dto.duration).to.be.equal(42);

		// expect(song.getArtist()).to.be.equal('TestArtist');
		// expect(song.getTrack()).to.be.equal('TestTrack');
		// expect(song.getAlbum()).to.be.equal('TestAlbum');
		// expect(song.getAlbumArtist()).to.be.equal('TestAlbumArtist');
		// expect(song.getUniqueId()).to.be.equal('UniqueId');
		// expect(song.getTrackArt()).to.be.equal('TestTrackArt');
		// expect(song.getCurrentTime()).to.be.equal(10);
		// expect(song.getDuration()).to.be.equal(42);
	});
}

function createSerializedSong(): SongDto {
	const originalSong = createSongStub({ uniqueID: 'UniqueId' });
	originalSong.setArtist('TestArtist');
	originalSong.setTrack('TestTrack');
	originalSong.setAlbum('TestAlbum');
	originalSong.setAlbumArtist('TestAlbumArtist');
	originalSong.setTrackArt('TestTrackArt');

	originalSong.setCurrentTime(10);
	originalSong.setDuration(42);

	return originalSong.serialize();
}
