import type { CoverArtProvider } from '@/background/provider/CoverArtProvider';
import type { Song } from '@/background/model/song/Song';
import type { SongPipelineStage } from '@/background/pipeline/SongPipelineStage';

export class CoverArtLoader implements SongPipelineStage {
	constructor(private provider: CoverArtProvider) {}

	async process(song: Song): Promise<void> {
		if (song.getTrackArt()) {
			return;
		}

		song.setTrackArt(await this.provider.getCoverArt(song));
	}
}
