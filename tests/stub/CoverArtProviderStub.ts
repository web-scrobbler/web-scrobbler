import type { CoverArtProvider } from '@/background/provider/CoverArtProvider';

export class CoverArtProviderStub implements CoverArtProvider {
	constructor(private coverArtUrl: string) {}

	getCoverArt(): Promise<string> {
		return Promise.resolve(this.coverArtUrl);
	}
}
