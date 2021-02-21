import type { Song } from '@/background/model/song/Song';

export interface SongPipelineStage {
	/**
	 * Process the given song.
	 *
	 * @param song Song
	 */
	process(song: Song): Promise<void>;
}
