import { Song } from '@/background/object/song';

import { loadEditedSongInfo } from '@/background/pipeline/processors/load-edited-song-info';
import { loadSongInfoFromScrobblers } from '@/background/pipeline/processors/load-song-info-from-scrobblers';
import { normalizeFields } from '@/background/pipeline/processors/normalize-fields';
import { fetchCoverArt } from '@/background/pipeline/processors/fetch-coverart';
import {
	ProcessedSongInfo,
	SongFlags,
	SongMetadata,
} from '@/background/object/song';

/**
 * Functions that process a song object. These function are called in the order
 * they listed in this array.
 */
const processors: ProcessSongFunction[] = [
	normalizeFields,
	loadEditedSongInfo,
	loadSongInfoFromScrobblers,
	fetchCoverArt,
];

export interface SongDiff {
	processed?: Partial<ProcessedSongInfo>;
	metadata?: Partial<SongMetadata>;
	flags?: Partial<SongFlags>;
}

export type ProcessSongFunction = (song: Song) => Promise<SongDiff>;

/**
 * An object that processes song instances using various processors (functions).
 */
export class Pipeline {
	song: Song = null;

	/**
	 * Run pipeline processors against the given song instance.
	 *
	 * @param song Song instance
	 *
	 * @return Process result
	 */
	async process(song: Song): Promise<boolean> {
		// FIXME: Use another lock way
		this.song = song;

		for (const processor of processors) {
			const { flags, metadata, processed } = await processor(song);

			song.flags = Object.assign(song.flags, flags);
			song.metadata = Object.assign(song.metadata, metadata);
			song.processed = Object.assign(song.processed, processed);
		}

		// Return false if this call is not relevant, e.g. when
		// the controller calls `process` with another song.
		return song.equals(this.song);
	}
}
