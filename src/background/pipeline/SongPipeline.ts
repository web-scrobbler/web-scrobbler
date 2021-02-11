import { Song } from '@/background/model/song/song';
import { Processor } from '@/background/pipeline/Processor';
import { Logger } from '@/background/util/Logger';

export class SongPipeline implements Processor<Song> {
	constructor(
		private processors: Processor<Song>[],
		private logger: Logger
	) {}

	async process(song: Song): Promise<void> {
		this.logger.debug(`Execute pipeline: ${this.processors.length}`);

		for (const processor of this.processors) {
			await processor.process(song);
		}
	}
}
