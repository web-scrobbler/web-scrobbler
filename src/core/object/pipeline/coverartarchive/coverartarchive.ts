import Song from '@/core/object/song';
import { MusicBrainzSearch } from './coverartarchive.types';
import { debugLog } from '@/core/content/util';
import { timeoutPromise } from '@/util/util';

/**
 * How long to wait before giving up on musicbrainz request.
 */
const REQUEST_TIMEOUT = 5000;

/**
 * Fetch coverart from MusicBrainz archive.
 * @param song - Song instance
 */
export async function process(song: Song): Promise<void> {
	if (song.parsed.trackArt) {
		debugLog('Using local/parsed artwork');
		return;
	} else if (song.metadata.trackArtUrl) {
		debugLog('Found album artwork via LastFM');
		return;
	} else if (song.isEmpty()) {
		return;
	}

	const endpoints = ['release', 'release-group'];
	for (const endpoint of endpoints) {
		let mbId = song.metadata.albumMbId;
		let coverArtUrl = null;

		try {
			if (!mbId) {
				mbId = await getMusicBrainzId(endpoint, song);
			}

			coverArtUrl = await checkCoverArt(mbId);
		} catch (e) {
			continue;
		}

		if (coverArtUrl) {
			debugLog('Found album artwork via MusicBrainz');

			song.metadata.trackArtUrl = coverArtUrl;
			return;
		}
	}
}

/**
 * Get track or album MusicBrainz ID.
 * Search API docs:
 * 	https://musicbrainz.org/doc/Development/XML_Web_Service/Version_2/Search
 * Query syntax docs:
 * 	https://lucene.apache.org/core/4_3_0/queryparser/org/apache/lucene/queryparser/classic/package-summary.html#package_description
 *
 * @param endpoint - Endpoint
 * @param song - Song object
 * @returns MusicBrainz ID
 */
async function getMusicBrainzId(endpoint: string, song: Song) {
	const artist = song.getArtist();
	const track = song.getTrack();

	if (artist === null || track === null) {
		throw new TypeError('artist or track is null');
	}

	const url =
		`https://musicbrainz.org/ws/2/${endpoint}?fmt=json&query=` +
		`title:+"${track ?? ''}"^3 ${track ?? ''} artistname:+"${
			artist ?? ''
		}"^4${artist ?? ''}`;
	const response = await timeoutPromise(REQUEST_TIMEOUT, fetch(url));
	if (!response.ok) {
		throw new Error('Unable to fetch MusicBrainz ID');
	}
	const musicbrainz = (await response.json()) as MusicBrainzSearch;

	if (musicbrainz.count === 0) {
		throw new Error('Unable to fetch MusicBrainz ID');
	}

	if ('releases' in musicbrainz) {
		return musicbrainz.releases[0].id;
	}
	if ('release-groups' in musicbrainz) {
		return musicbrainz['release-groups'][0].id;
	}
	return '';
}

/**
 * Check if cover art is accessible.
 * @param mbid - MusicBrainz ID of track or album
 * @returns Cover art URL
 */
async function checkCoverArt(mbid: string) {
	const coverArtUrl = `https://coverartarchive.org/release/${mbid}/front-500`;
	const response = await timeoutPromise(
		REQUEST_TIMEOUT,
		fetch(coverArtUrl, { method: 'HEAD' }),
	);
	if (response.ok) {
		return coverArtUrl;
	}

	throw new Error('Unable to fetch cover art from MusicBrainz');
}
