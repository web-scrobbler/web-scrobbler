import { expect } from 'chai';

import { getTestName } from '#/helpers/util';
import { MockedCoverArtFetcher } from '#/mock/MockedCoverArtFetcher';

import { Song } from '@/background/model/song/Song';
import { Processor } from '@/background/pipeline/Processor';
import { CoverArtProcessor } from '@/background/pipeline/processor/CoverArtProcessor';

import { createSongStub } from '#/stub/SongStubFactory';

describe(getTestName(__filename), () => {
	const processor = createProcessor();

	it('should replace track art URL', async () => {
		const song = createSongStub();
		await processor.process(song);

		expect(song.getTrackArt()).equal('fetched-track-art-url');
	});

	it('should not replace existing track art URL', async () => {
		const song = createSongStub();
		song.setTrackArt('external-track-art-url');
		await processor.process(song);

		expect(song.getTrackArt()).equal('external-track-art-url');
	});
});

function createProcessor(): Processor<Song> {
	// TODO check if fetcher is not executed if it's not needed
	const coverArtFetcher = new MockedCoverArtFetcher('fetched-track-art-url');
	return new CoverArtProcessor(coverArtFetcher);
}
