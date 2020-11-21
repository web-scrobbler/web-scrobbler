import { Song } from '@/background/object/song';

import { SongDiff } from '@/background/pipeline/pipeline';

type Endpoint = 'release' | 'release-group';
type EndPointKey = 'releases' | 'release-groups';

interface EndpointInfo {
	id: string;
}

interface MusicBrainzResponse {
	count: number;
	releases: EndpointInfo[];
	'release-groups': EndpointInfo[];
}

const endpoints: Record<Endpoint, EndPointKey> = {
	release: 'releases',
	'release-group': 'release-groups',
};

/**
 * Fetch a song coverart from CoverArtArchive.
 *
 * @param song Song instance
 *
 * @return Cover art from CoverArtArchive.
 */
export async function fetchCoverArt(song: Song): Promise<SongDiff> {
	if (song.parsed.trackArt) {
		console.log('Using local/parsed artwork');
		return {};
	}

	if (song.metadata.trackArtUrl) {
		console.log('Found album artwork via LastFM');
		return {};
	}

	if (song.isEmpty()) {
		return {};
	}

	for (const endpoint in endpoints) {
		let mbId = song.metadata.albumMbId;

		try {
			if (!mbId) {
				mbId = await getMusicBrainzId(endpoint as Endpoint, song);
			}

			const trackArtUrl = await getCoverArtByMbId(mbId);
			if (trackArtUrl) {
				console.log('Found album artwork via MusicBrainz');
			}

			return { metadata: { trackArtUrl } };
		} catch {}
	}

	return {};
}

/**
 * Get track or album MusicBrainz ID.
 * Search API docs:
 * 	http://musicbrainz.org/doc/Development/XML_Web_Service/Version_2/Search
 * Query syntax docs:
 * 	https://lucene.apache.org/core/4_3_0/queryparser/org/apache/lucene/queryparser/classic/package-summary.html#package_description
 *
 * @param endpoint Endpoint
 * @param song Song object
 *
 * @return MusicBrainz ID
 */
async function getMusicBrainzId(
	endpoint: Endpoint,
	song: Song
): Promise<string> {
	const artist = song.getArtist();
	const track = song.getTrack();

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
async function getCoverArtByMbId(mbid: string): Promise<string> {
	const coverArtUrl = `http://coverartarchive.org/release/${mbid}/front-500`;
	const response = await fetch(coverArtUrl, { method: 'HEAD' });
	if (response.ok) {
		return coverArtUrl;
	}

	throw new Error('Unable to fetch cover art from MusicBrainz');
}
