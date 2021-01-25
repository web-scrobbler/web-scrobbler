import { Song } from '@/background/model/song/song';
import { Processor } from '@/background/pipeline/Processor';
import Logger, { ILogger } from 'js-logger';

export class SongPipeline implements Processor<Song> {
	private logger: ILogger;

	constructor(private processors: Processor<Song>[]) {
		this.logger = Logger.get('SongPipeline');
	}

	async process(song: Song): Promise<void> {
		this.logger.debug('Execute pipeline:', this.processors.length);

		for (const processor of this.processors) {
			await processor.process(song);
		}
	}
}
