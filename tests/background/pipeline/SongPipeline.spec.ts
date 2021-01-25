/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { expect, spy } from 'chai';

import { getTestName } from '#/helpers/util';

import { Song } from '@/background/model/song/Song';
import { Processor } from '@/background/pipeline/Processor';
import { SongPipeline } from '@/background/pipeline/SongPipeline';
import { createSongStub } from '#/stub/SongStubFactory';

describe(getTestName(__filename), () => {
	it('should execute all stages', async () => {
		const processor1 = createDummyProcessor();
		const processor2 = createDummyProcessor();

		const spyMethod1 = spy.on(processor1, 'process');
		const spyMethod2 = spy.on(processor2, 'process');

		const pipeline = new SongPipeline([processor1, processor2]);
		await pipeline.process(createSongStub());

		expect(spyMethod1).to.have.called.exactly(1);
		expect(spyMethod2).to.have.called.exactly(1);
	});
});

function createDummyProcessor(): Processor<Song> {
	return new (class implements Processor<Song> {
		process(): Promise<void> {
			return Promise.resolve();
		}
	})();
}
