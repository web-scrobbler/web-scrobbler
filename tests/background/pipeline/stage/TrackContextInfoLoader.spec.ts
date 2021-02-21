import { expect } from 'chai';

import { createSongStub } from '#/stub/SongStubFactory';
import { describeModuleTest } from '#/helpers/util';
import { TrackContextInfoProviderStub } from '#/stub/TrackContextInfoStub';

import { TrackContextInfoLoader } from '@/background/pipeline/stage/TrackContextInfoLoader';
import { LoveStatus } from '@/background/model/song/LoveStatus';

import type { Song } from '@/background/model/song/Song';

describeModuleTest(__filename, () => {
	const provider = new TrackContextInfoProviderStub();
	const pipelineStage = new TrackContextInfoLoader(provider);

	let song: Song;
	beforeEach(() => {
		song = createSongStub();
	});

	it('should not fail if no track context info is provided', async () => {
		provider.useTrackContextInfo([]);
		await pipelineStage.process(song);

		expect(song.getMetadata('userPlayCount')).to.be.equal(undefined);
		expect(song.getLoveStatus()).to.be.equal(LoveStatus.Unknown);
	});

	it('should not fail if empty track context info is provided', async () => {
		provider.useTrackContextInfo([null, null]);
		await pipelineStage.process(song);

		expect(song.getMetadata('userPlayCount')).to.be.equal(undefined);
		expect(song.getLoveStatus()).to.be.equal(LoveStatus.Unknown);
	});

	it('should load user play count from first object', async () => {
		provider.useTrackContextInfo([
			{ userPlayCount: 1 },
			{ userPlayCount: 4 },
		]);
		await pipelineStage.process(song);

		expect(song.getMetadata('userPlayCount')).to.be.equal(1);
	});

	it('should set loved status if all info have loved status', async () => {
		provider.useTrackContextInfo([
			{ loveStatus: LoveStatus.Loved },
			{ loveStatus: LoveStatus.Loved },
		]);
		await pipelineStage.process(song);

		expect(song.getLoveStatus()).to.be.equal(LoveStatus.Loved);
	});

	it('should set loved status if any info have no love status and other have loved status', async () => {
		provider.useTrackContextInfo([
			{ loveStatus: LoveStatus.Loved },
			{ loveStatus: LoveStatus.Loved },
			{},
		]);
		await pipelineStage.process(song);

		expect(song.getLoveStatus()).to.be.equal(LoveStatus.Loved);
	});

	it('should set unloved status if at least one info have unloved status', async () => {
		provider.useTrackContextInfo([
			{ loveStatus: LoveStatus.Loved },
			{ loveStatus: LoveStatus.Unloved },
		]);
		await pipelineStage.process(song);

		expect(song.getLoveStatus()).to.be.equal(LoveStatus.Unloved);
	});
});
