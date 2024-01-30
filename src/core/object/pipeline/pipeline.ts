/**
 * The module applies functions provided by pipeline stages to given song.
 */
import * as UserInput from '@/core/object/pipeline/user-input';
import * as Copy from '@/core/object/pipeline/copy';
import * as Metadata from '@/core/object/pipeline/metadata';
import * as Normalize from '@/core/object/pipeline/normalize';
import * as RegexEdits from '@/core/object/pipeline/regex-edits';
import * as CoverArtArchive from '@/core/object/pipeline/coverartarchive/coverartarchive';
import * as BlockedTags from '@/core/object/pipeline/blocked-tags';
import Song from '@/core/object/song';
import { ConnectorMeta } from '@/core/connectors';

export default class Pipeline {
	private song: Song | null = null;
	private processors = [
		Copy,
		Normalize,
		UserInput,
		RegexEdits,
		Metadata,
		RegexEdits, // Run regex edits again, as the regex edit might have caused an album to be found.
		BlockedTags,
		CoverArtArchive,
	];
	constructor() {
		this.song = null;
	}

	async process(song: Song, connector: ConnectorMeta): Promise<boolean> {
		// FIXME: Use another lock way
		this.song = song;
		this.song.flags.finishedProcessing = false;

		try {
			for (const processor of this.processors) {
				await processor.process(song, connector);
			}
			this.song.flags.finishedProcessing = true;
		} catch (err) {
			// mark as done even though it errored.
			this.song.flags.finishedProcessing = true;
			throw err;
		}

		// Return false if this call is not relevant, e.g. when
		// the controller calls `process` with another song.
		return song.equals(this.song);
	}
}
