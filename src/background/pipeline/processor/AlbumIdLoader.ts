import type { Song } from '@/background/model/song/Song';
import type { SongPipelineStage } from '@/background/pipeline/SongPipelineStage';
import type { AlbumIdProvider } from '@/background/provider/album-id/AlbumIdProvider';

export class AlbumIdLoader implements SongPipelineStage {
	constructor(private provider: AlbumIdProvider) {}

	async process(song: Song): Promise<void> {
		song.setMetadata('albumMbId', await this.provider.getAlbumId(song));
	}
}
