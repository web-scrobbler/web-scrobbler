import { Song } from '@/background/model/song/Song';
import { CoverArtFetcher } from '@/background/service/CoverArtFetcher';

export class MockedCoverArtFetcher implements CoverArtFetcher {
	constructor(private coverArtUrl: string) {}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	getCoverArt(song: Song): Promise<string> {
		return Promise.resolve(this.coverArtUrl);
	}
}
