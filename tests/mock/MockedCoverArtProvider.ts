import type { CoverArtProvider } from '@/background/provider/CoverArtProvider';

export class MockedCoverArtProvider implements CoverArtProvider {
	constructor(private coverArtUrl: string) {}

	getCoverArt(): Promise<string> {
		return Promise.resolve(this.coverArtUrl);
	}
}
