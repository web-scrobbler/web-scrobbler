import { expect } from 'chai';

import { describeModuleTest } from '#/helpers/util';
import { createSongStub } from '#/stub/SongStubFactory';

import { FieldNormalizer } from '@/background/pipeline/processor/FieldNormalizer';

describeModuleTest(__filename, () => {
	const processor = new FieldNormalizer();

	it('should normalize all fields', async () => {
		const inputField = '\u0041\u006d\u0065\u0301\u006c\u0069\u0065';
		const normalizedField = '\u0041\u006d\u00e9\u006c\u0069\u0065';

		const song = createSongStub({
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

		expect(song.getArtist()).equal(null);
		expect(song.getTrack()).equal(null);
	});
});
