import { Song } from '@/background/object/song';
import { Processor } from '@/background/pipeline/Processor';
import { CoverArtFetcher } from '@/background/service/CoverArtFetcher';

export class CoverArtProcessor implements Processor<Song> {
	constructor(private fetcher: CoverArtFetcher) {}

	async process(song: Song): Promise<void> {
		const coverArtUrl = await this.fetcher.getCoverArt(song);

		song.metadata.trackArtUrl = coverArtUrl;
	}
}
