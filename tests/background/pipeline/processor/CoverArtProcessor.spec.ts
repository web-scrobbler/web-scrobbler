import { expect, spy } from 'chai';

import { MockedCoverArtProvider } from '#/mock/MockedCoverArtProvider';
import { createSongStub } from '#/stub/SongStubFactory';
import { getTestName } from '#/helpers/util';

import { CoverArtProcessor } from '@/background/pipeline/processor/CoverArtProcessor';

import type { CoverArtProvider } from '@/background/provider/CoverArtProvider';
import type { Processor } from '@/background/pipeline/Processor';
import type { Song } from '@/background/model/song/Song';

describe(getTestName(__filename), () => {
	let provider: CoverArtProvider;
	let processor: Processor<Song>;
	let spyMethod: unknown;

	beforeEach(() => {
		provider = new MockedCoverArtProvider('fetched-track-art-url');
		processor = new CoverArtProcessor(provider);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		spyMethod = spy.on(provider, 'getCoverArt');
	});

	it('should replace track art URL', async () => {
		const song = createSongStub();
		await processor.process(song);

		expect(song.getTrackArt()).equal('fetched-track-art-url');
	});

	it('should not replace existing track art URL', async () => {
		const song = createSongStub({ trackArt: 'external-track-art-url' });
		await processor.process(song);

		expect(song.getTrackArt()).equal('external-track-art-url');
		expect(spyMethod).to.not.have.called;
	});
});
