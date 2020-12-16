import { Song } from '@/background/object/song';
import { Processor } from '@/background/pipeline/Processor';

export class SongPipeline implements Processor<Song> {
	constructor(private processors: Processor<Song>[]) {}

	async process(song: Song): Promise<void> {
		for (const processor of this.processors) {
			await processor.process(song);
		}
	}
}
