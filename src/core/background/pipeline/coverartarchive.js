'use strict';

define(() => {
	/**
	 * Fetch coverart from MusicBrainz archive.
	 * @param  {Object} song Song instance
	 */
	async function process(song) {
		if (song.parsed.trackArt) {
			console.log('Using local/parsed artwork');
			return;
		} else if (song.metadata.artistThumbUrl) {
			console.log('Found album artwork via LastFM');
			return;
		} else if (song.isEmpty()) {
			return;
		}

		let endpoints = ['release', 'release-group'];
		for (let endpoint of endpoints) {
			try {
				let mbId = await getMusicBrainzId(endpoint, song);
				let coverArtUrl = await checkCoverArt(mbId);
				if (coverArtUrl) {
					console.log('Found album artwork via MusicBrainz');

					song.metadata.artistThumbUrl = coverArtUrl;
					return;
				}
			} catch (e) {

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
	 * @param  {String} endpoint Endpoint
	 * @param  {Object} song Song object
	 * @return {String} MusicBrainz ID
	 */
	async function getMusicBrainzId(endpoint, song) {
		let artist = song.getArtist();
		let track = song.getTrack();

		let url = `http://musicbrainz.org/ws/2/${endpoint}?fmt=json&query=` +
			`title:+"${track}"^3 ${track} artistname:+"${artist}"^4${artist}`;
		let response = await fetch(url);
		if (!response.ok) {
			throw new Error('Unable to fetch MusicBrainz ID');
		}
		let musicbrainz = await response.json();

		if (musicbrainz.count === 0) {
			throw new Error('Unable to fetch MusicBrainz ID');
		}

		let results = musicbrainz[`${endpoint}s`];
		let mbid = results[0].id;
		song.metadata.musicBrainzId = mbid;

		return mbid;
	}

	/**
	 * Check if cover art is accessible.
	 * @param  {String} mbid MusicBrainz ID of track or album
	 * @return {String} Cover art URL
	 */
	async function checkCoverArt(mbid) {
		let coverArtUrl = `http://coverartarchive.org/release/${mbid}/front`;
		let response = await fetch(coverArtUrl, { 'method': 'HEAD' });
		if (response.ok) {
			return coverArtUrl;
		}

		throw new Error('Unable to fetch cover art from MusicBrainz');
	}

	return { process };
});
