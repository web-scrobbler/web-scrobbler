import { Song } from '@/background/model/song/Song';
import { AlbumIdProvider } from '@/background/provider/album-id/AlbumIdProvider';
import { FetchWrapper } from '@/background/util/fetch/Fetch';

type Endpoint = 'release' | 'release-group';
type EndPointKey = 'releases' | 'release-groups';

const endpoints: Record<Endpoint, EndPointKey> = {
	release: 'releases',
	'release-group': 'release-groups',
};

interface EndpointInfo {
	id: string;
}

interface MusicBrainzResponse {
	count: number;
	releases: EndpointInfo[];
	'release-groups': EndpointInfo[];
}

export class MusicBrainzAlbumIdProvider implements AlbumIdProvider {
	constructor(private fetch: FetchWrapper<MusicBrainzResponse>) {}

	async getAlbumId(song: Song): Promise<string> {
		let musicBrainzId: string = null;

		for (const endpoint in endpoints) {
			try {
				if (!musicBrainzId) {
					musicBrainzId = await this.getMusicBrainzId(
						endpoint as Endpoint,
						song.getArtist(),
						song.getTrack()
					);
				}

				return musicBrainzId;
			} catch {}
		}

		return null;
	}

	/**
	 * Get track or album MusicBrainz ID.
	 * Search API docs: http://musicbrainz.org/doc/Development/XML_Web_Service/Version_2/Search
	 * Query syntax docs: https://lucene.apache.org/core/4_3_0/queryparser/org/apache/lucene/queryparser/classic/package-summary.html#package_description
	 *
	 * @param endpoint Endpoint
	 * @param artist Artist name
	 * @param track Track title
	 *
	 * @return MusicBrainz ID
	 */
	private async getMusicBrainzId(
		endpoint: Endpoint,
		artist: string,
		track: string
	): Promise<string> {
		const url =
			`http://musicbrainz.org/ws/2/${endpoint}?fmt=json&query=` +
			`title:+"${track}"^3 ${track} artistname:+"${artist}"^4${artist}`;
		const { data, ok } = await this.fetch(url);
		if (!ok) {
			throw new Error('Unable to fetch MusicBrainz ID');
		}

		if (data.count === 0) {
			throw new Error('Unable to fetch MusicBrainz ID');
		}

		const results = data[endpoints[endpoint]];
		return results[0].id;
	}
}
