import { Song } from '@/background/model/song/Song';
import { Processor } from '@/background/pipeline/Processor';
import { CoverArtProvider } from '@/background/provider/CoverArtProvider';

export class CoverArtProcessor implements Processor<Song> {
	constructor(private provider: CoverArtProvider) {}

	async process(song: Song): Promise<void> {
		if (song.getTrackArt()) {
			return;
		}

		song.setTrackArt(await this.provider.getCoverArt(song));
	}
}
