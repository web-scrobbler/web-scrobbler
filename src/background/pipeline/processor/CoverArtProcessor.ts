import { Song } from '@/background/model/song/Song';
import { Processor } from '@/background/pipeline/Processor';
import { CoverArtFetcher } from '@/background/service/CoverArtFetcher';

export class CoverArtProcessor implements Processor<Song> {
	constructor(private fetcher: CoverArtFetcher) {}

	async process(song: Song): Promise<void> {
		if (song.getTrackArt()) {
			return;
		}

		song.setTrackArt(await this.fetcher.getCoverArt(song));
	}
}
