/* eslint-disable indent */

import { Song } from '@/background/model/song/Song';
import { CoverArtFetcher } from '@/background/service/CoverArtFetcher';

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

export class CoverArtArchiveFetcher implements CoverArtFetcher {
	async getCoverArt(song: Song): Promise<string> {
		let musicBrainzId = song.getMetadata('albumMbId');

		for (const endpoint in endpoints) {
			try {
				if (!musicBrainzId) {
					musicBrainzId = await this.getMusicBrainzId(
						endpoint as Endpoint,
						song.getArtist(),
						song.getTrack()
					);
				}

				return this.getCoverArtByMbId(musicBrainzId);
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
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error('Unable to fetch MusicBrainz ID');
		}
		const musicbrainz = (await response.json()) as MusicBrainzResponse;

		if (musicbrainz.count === 0) {
			throw new Error('Unable to fetch MusicBrainz ID');
		}

		const results = musicbrainz[endpoints[endpoint]];
		return results[0].id;
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
}
