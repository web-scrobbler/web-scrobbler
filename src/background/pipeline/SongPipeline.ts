import { Song } from '@/background/model/song/song';
import { SongPipelineStage } from '@/background/pipeline/SongPipelineStage';
import { Logger } from '@/background/util/Logger';

export class SongPipeline {
	constructor(
		private pipelineStages: SongPipelineStage[],
		private logger: Logger
	) {}

	async process(song: Song): Promise<void> {
		this.logger.debug(`Execute pipeline: ${this.pipelineStages.length}`);

		for (const stage of this.pipelineStages) {
			await stage.process(song);
		}
	}
}
