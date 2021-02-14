import { expect } from 'chai';

import { describeModuleTest } from '#/helpers/util';

import {
	ConnectorStateWorker,
	SongUpdateListener2,
} from '@/background/ConnectorStateWorker';

describeModuleTest(__filename, () => {
	it('should have no song by default', () => {
		const worker = new ConnectorStateWorker(dummySongUpdateListener);

		expect(worker.getSong()).to.be.null;
	});

	it('should not create new song if empty state is received', () => {
		const emptyState = {};
		const emptyStateWithId = { uniqueID: 'unique' };
		const emptyStateWithDuration = { duration: 42 };

		const worker = new ConnectorStateWorker(dummySongUpdateListener);

		// @ts-expect-error
		worker.process(emptyState);
		expect(worker.getSong()).to.be.null;

		// @ts-expect-error
		worker.process(emptyStateWithId);
		expect(worker.getSong()).to.be.null;

		// @ts-expect-error
		worker.process(emptyStateWithDuration);
		expect(worker.getSong()).to.be.null;
	});

	it('should create a new song when state is received', () => {
		const newState = { artist: 'Artist', track: 'Track', isPlaying: true };

		const worker = new ConnectorStateWorker(dummySongUpdateListener);
		worker.process(newState);

		const song = worker.getSong();
		expect(song.getArtist()).to.equal(newState.artist);
		expect(song.getTrack()).to.equal(newState.track);
	});

	it('should update the song when state is received', () => {
		const newState = { artist: 'Artist', track: 'Track', isPlaying: true };
		const pausedState = { ...newState, isPlaying: true };

		const worker = new ConnectorStateWorker(dummySongUpdateListener);
		worker.process(newState);
		worker.process(pausedState);

		const song = worker.getSong();
		expect(song.isPlaying()).to.equal(pausedState.isPlaying);
	});

	it('should recreate the new song when state is received', () => {
		const newStateSong1 = {
			artist: 'Artist 1',
			track: 'Track 1',
			isPlaying: true,
		};
		const newStateSong2 = {
			artist: 'Artist 2',
			track: 'Track 2',
			isPlaying: true,
		};

		const worker = new ConnectorStateWorker(dummySongUpdateListener);
		worker.process(newStateSong1);
		worker.process(newStateSong2);

		const song = worker.getSong();
		expect(song.getArtist()).to.equal(newStateSong2.artist);
		expect(song.getTrack()).to.equal(newStateSong2.track);
	});

	it('should not recreate the new song when paused is received', () => {
		const newStatePlayingSong1 = {
			artist: 'Artist 1',
			track: 'Track 1',
			isPlaying: true,
		};
		const newStatePausedSong2 = {
			artist: 'Artist 2',
			track: 'Track 2',
			isPlaying: false,
		};

		const worker = new ConnectorStateWorker(dummySongUpdateListener);
		worker.process(newStatePlayingSong1);
		worker.process(newStatePausedSong2);

		expect(worker.getSong()).to.be.null;
	});
});

const dummySongUpdateListener = new (class implements SongUpdateListener2 {
	onSongDurationChanged(): void {
		// Do nothing
	}

	onPlayingStateChanged(): void {
		// Do nothing
	}

	onSongChanged(): void {
		// Do nothing
	}
})();
