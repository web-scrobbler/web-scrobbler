import { Song } from '@/background/model/song/Song';
import { SongPipelineStage } from '@/background/pipeline/SongPipelineStage';
import { CoverArtProvider } from '@/background/provider/CoverArtProvider';

export class CoverArtLoader implements SongPipelineStage {
	constructor(private provider: CoverArtProvider) {}

	async process(song: Song): Promise<void> {
		if (song.getTrackArt()) {
			return;
		}

		song.setTrackArt(await this.provider.getCoverArt(song));
	}
}
