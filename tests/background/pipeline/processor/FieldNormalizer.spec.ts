import { expect } from 'chai';

import { getTestName } from '#/helpers/util';

import { Song } from '@/background/model/song/Song';
import { Processor } from '@/background/pipeline/Processor';
import { FieldNormalizer } from '@/background/pipeline/processor/FieldNormalizer';

import { createSong } from '@/background/model/song/SongFactory';
import { createSongStub } from '#/stub/SongStubFactory';

describe(getTestName(__filename), () => {
	const processor = createProcessor();

	it('should normalize all fields', async () => {
		const inputField = '\u0041\u006d\u0065\u0301\u006c\u0069\u0065';
		const normalizedField = '\u0041\u006d\u00e9\u006c\u0069\u0065';

		const song = createSong({
			artist: inputField,
			track: inputField,
			album: inputField,
			albumArtist: inputField,
		});

		await processor.process(song);

		expect(song.getArtist()).equal(normalizedField);
		expect(song.getTrack()).equal(normalizedField);
		expect(song.getAlbum()).equal(normalizedField);
		expect(song.getAlbumArtist()).equal(normalizedField);
	});

	it('should normalize non-empty fields', async () => {
		const inputField = '\u0041\u006d\u0065\u0301\u006c\u0069\u0065';
		const normalizedField = '\u0041\u006d\u00e9\u006c\u0069\u0065';

		const song = createSongStub({
			artist: inputField,
			track: inputField,
		});

		await processor.process(song);

		expect(song.getArtist()).equal(normalizedField);
		expect(song.getTrack()).equal(normalizedField);
		expect(song.getAlbum()).equal(null);
		expect(song.getAlbumArtist()).equal(null);
	});

	it('should not process empty song', async () => {
		const song = createSongStub({ artist: null, track: null });

		await processor.process(song);
		// TODO check if fetcher is not executed if it's not needed

		expect(song.getArtist()).equal(null);
		expect(song.getTrack()).equal(null);
	});
});

function createProcessor(): Processor<Song> {
	return new FieldNormalizer();
}
