'use strict';

/**
 * The module applies functions provided by pipeline stages to given song.
 */
define((require) => {
	const UserInput = require('pipeline/user-input');
	const Metadata = require('pipeline/metadata');
	const Normalize = require('pipeline/normalize');
	const CoverArtArchive = require('pipeline/coverartarchive');

	class Pipeline {
		constructor() {
			this.song = null;
			this.processors = [
				Normalize, UserInput, Metadata, CoverArtArchive,
			];
		}

		async process(song, connector) {
			// FIXME: Use another lock way
			this.song = song;

			for (const processor of this.processors) {
				await processor.process(song, connector);
			}

			// Return false if this call is not relevant, e.g. when
			// the controller calls `process` with another song.
			return song.equals(this.song);
		}
	}

	return Pipeline;
});
