import type { Song } from '@/background/model/song/Song';
import type { Processor } from '@/background/pipeline/Processor';
import type { AlbumIdProvider } from '@/background/provider/album-id/AlbumIdProvider';

export class AlbumIdLoader implements Processor<Song> {
	constructor(private provider: AlbumIdProvider) {}

	async process(song: Song): Promise<void> {
		song.setMetadata('albumMbId', await this.provider.getAlbumId(song));
	}
}
