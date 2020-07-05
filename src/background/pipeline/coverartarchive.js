/**
 * Fetch coverart from MusicBrainz archive.
 *
 * @param {Object} song Song instance
 */
export async function process(song) {
	if (song.parsed.trackArt) {
		console.log('Using local/parsed artwork');
		return;
	} else if (song.metadata.trackArtUrl) {
		console.log('Found album artwork via LastFM');
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
			console.log('Found album artwork via MusicBrainz');

			song.metadata.trackArtUrl = coverArtUrl;
			return;
		}
	}
}

/**
 * Get track or album MusicBrainz ID.
 * Search API docs:
 *	http://musicbrainz.org/doc/Development/XML_Web_Service/Version_2/Search
 * Query syntax docs:
 *	https://lucene.apache.org/core/4_3_0/queryparser/org/apache/lucene/queryparser/classic/package-summary.html#package_description
 *
 * @param {String} endpoint Endpoint
 * @param {Object} song Song object
 *
 * @return {String} MusicBrainz ID
 */
async function getMusicBrainzId(endpoint, song) {
	const artist = song.getArtist();
	const track = song.getTrack();

	const url =
		`http://musicbrainz.org/ws/2/${endpoint}?fmt=json&query=` +
		`title:+"${track}"^3 ${track} artistname:+"${artist}"^4${artist}`;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error('Unable to fetch MusicBrainz ID');
	}
	const musicbrainz = await response.json();

	if (musicbrainz.count === 0) {
		throw new Error('Unable to fetch MusicBrainz ID');
	}

	const results = musicbrainz[`${endpoint}s`];
	return results[0].id;
}

/**
 * Check if cover art is accessible.
 *
 * @param {String} mbid MusicBrainz ID of track or album
 *
 * @return {String} Cover art URL
 */
async function checkCoverArt(mbid) {
	const coverArtUrl = `http://coverartarchive.org/release/${mbid}/front-500`;
	const response = await fetch(coverArtUrl, { method: 'HEAD' });
	if (response.ok) {
		return coverArtUrl;
	}

	throw new Error('Unable to fetch cover art from MusicBrainz');
}
