import * as CoverArtArchive from '@/background/pipeline/coverartarchive';
import * as Metadata from '@/background/pipeline/metadata';
import * as Normalize from '@/background/pipeline/normalize';
import * as UserInput from '@/background/pipeline/user-input';

export default class Pipeline {
	constructor() {
		this.song = null;
		this.processors = [Normalize, UserInput, Metadata, CoverArtArchive];
	}

	async process(song) {
		// FIXME: Use another lock way
		this.song = song;

		for (const processor of this.processors) {
			await processor.process(song);
		}

		// Return false if this call is not relevant, e.g. when
		// the controller calls `process` with another song.
		return song.equals(this.song);
	}
}
