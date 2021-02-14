import type { Song } from '@/background/model/song/Song';
import type { CoverArtProvider } from '@/background/provider/CoverArtProvider';
import type { FetchWrapper } from '@/background/util/fetch/Fetch';

export class CoverArtArchiveProvider implements CoverArtProvider {
	constructor(private fetch: FetchWrapper<MusicBrainzResponse>) {}

	async getCoverArt(song: Song): Promise<string> {
		for await (const albumId of this.generateAlbumMbIds(song)) {
			if (albumId) {
				return this.getCoverArtByMbId(albumId);
			}
		}

		return null;
	}

	/**
	 * Generate possible album IDs for the given song.
	 *
	 * @param song Song
	 *
	 * @return Album ID
	 */
	private async *generateAlbumMbIds(song: Song): AsyncGenerator<string> {
		yield song.getMetadata('albumMbId');
		yield await this.getAlbumId(song, 'release');
		yield await this.getAlbumId(song, 'release-group');
	}

	/**
	 * Return an URL to a coverart for the given MusicBrainz ID.
	 *
	 * @param mbid MusicBrainz ID of track or album
	 *
	 * @return Cover art URL
	 */
	private async getCoverArtByMbId(mbid: string): Promise<string> {
		const coverArtUrl = `http://coverartarchive.org/release/${mbid}/front-500`;
		const response = await fetch(coverArtUrl, { method: 'HEAD' });
		if (response.ok) {
			return coverArtUrl;
		}

		throw new Error('Unable to fetch cover art from MusicBrainz');
	}

	private async getAlbumId(song: Song, endpoint: Endpoint): Promise<string> {
		const artist = song.getArtist();
		const track = song.getTrack();

		try {
			return await this.getMusicBrainzId(endpoint, artist, track);
		} catch {}

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
			throw new Error('Empty response');
		}

		const endpointKey = endpoints[endpoint];
		const results = data[endpointKey];

		return results[0].id;
	}
}

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
