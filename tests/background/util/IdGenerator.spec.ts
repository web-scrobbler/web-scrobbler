import { expect } from 'chai';

import { describeModuleTest } from '#/helpers/util';
import { generateId } from '@/background/util/id-generator/IdGenerator';

describeModuleTest(__filename, () => {
	it('should throw error if seed is empty', () => {
		expect(() => getGeneratorValuesFromSeed([])).to.throw();
	});

	it('should throw error if seed contains one element', () => {
		expect(() => getGeneratorValuesFromSeed(['Artist'])).to.throw();
	});

	it('should throw error if all seed values are empty', () => {
		expect(() => getGeneratorValuesFromSeed(['', ''])).to.throw();
	});

	it('should throw error if all seed values are null', () => {
		expect(() => getGeneratorValuesFromSeed([null, null])).to.throw();
	});

	it('should generate proper ID for Artist+Track seed', () => {
		const generatorValues = getGeneratorValuesFromSeed(['Artist', 'Track']);

		expect(generatorValues).to.eql(['ArtistTrack']);
	});

	it('should generate proper ID for Artist+Track+Album seed', () => {
		const generatorValues = getGeneratorValuesFromSeed([
			'Artist',
			'Track',
			'Album',
		]);

		expect(generatorValues).to.eql(['ArtistTrackAlbum', 'ArtistTrack']);
	});

	it('should should skip empty seed values', () => {
		const generatorValues = getGeneratorValuesFromSeed([
			'Artist',
			'Track',
			'',
			'AlbumArtist',
		]);

		expect(generatorValues).to.eql([
			'ArtistTrackAlbumArtist',
			'ArtistTrack',
			'ArtistTrack',
		]);
	});

	it('should should skip nullable seed values', () => {
		const generatorValues = getGeneratorValuesFromSeed([
			'Artist',
			'Track',
			null,
			'AlbumArtist',
		]);

		expect(generatorValues).to.eql([
			'ArtistTrackAlbumArtist',
			'ArtistTrack',
			'ArtistTrack',
		]);
	});
});

function getGeneratorValuesFromSeed(seed: string[]): string[] {
	const generator = generateId(seed, (input) => input);

	return Array.from(generator);
}
