'use strict';

define(() => {
	/**
	 * Get array of functions that return promises.
	 * Used for delayed promise execute.
	 * @param  {Object} song Song instance
	 * @return {Array} Array of promise factories
	 */
	function getPromiseFactories(song) {
		let endpoints = ['release', 'release-group'];
		return endpoints.map((endpoint) => {
			return function() {
				return getMusicBrainzId(endpoint, song).then((mbid) => {
					return checkCoverArt(mbid);
				});
			};
		});
	}

	/**
	 * Fetch coverart from MusicBrainz archive.
	 * @param  {Object} song Song instance
	 * @return {Promise} Promise that will be resolved then the task will complete
	 */
	function process(song) {
		// Only query APIs if no cover art can be found
		if (song.parsed.trackArt) {
			console.log('Using local/parsed artwork');
			return Promise.resolve();
		} else if (song.metadata.artistThumbUrl) {
			console.log('Found album artwork via LastFM');
			return Promise.resolve();
		} else if (song.isEmpty()) {
			return Promise.resolve();
		}

		let isCoverArtFound = false;
		let promiseSequence = Promise.resolve();

		// Queue promises
		getPromiseFactories(song).forEach((promiseFactory) => {
			promiseSequence = promiseSequence.then(() => {
				// Should be checked in runtime
				if (!isCoverArtFound) {
					let promise = promiseFactory();
					return promise.then((coverArtUrl) => {
						isCoverArtFound = true;

						song.metadata.attr('artistThumbUrl', coverArtUrl);
						console.log('Found album artwork via MusicBrainz');
					}).catch(() => {
						// Suppress errors
					});
				}
			});
		});

		return promiseSequence;
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
	 * @return {Promise} Promise that will resolve with MusicBrainz ID
	 */
	function getMusicBrainzId(endpoint, song) {
		let artist = song.getArtist();
		let track = song.getTrack();

		let url = `http://musicbrainz.org/ws/2/${endpoint}?fmt=json&query=` +
			`title:+"${track}"^3 ${track} artistname:+"${artist}"^4${artist}`;
		return fetch(url).then((response) => {
			if (!response.ok) {
				throw new Error('Unable to fetch MusicBrainz ID');
			}
			return response.json();
		}).then((musicbrainz) => {
			if (musicbrainz.count === 0) {
				throw new Error('Unable to fetch MusicBrainz ID');
			}

			let results = musicbrainz[`${endpoint}s`];
			let mbid = results[0].id;
			song.metadata.musicBrainzId = mbid;

			return mbid;
		});
	}

	/**
	 * Check if cover art is accessible.
	 * @param  {String} mbid MusicBrainz ID of track or album
	 * @return {Promise} Promise that will resolve with accessible cover art url
	 */
	function checkCoverArt(mbid) {
		let coverArtUrl = `http://coverartarchive.org/release/${mbid}/front`;
		return fetch(coverArtUrl, { 'method': 'HEAD' }).then((result) => {
			if (result.ok) {
				return coverArtUrl;
			}
			throw new Error('Unable to fetch cover art from MusicBrainz');
		});
	}

	return { process };
});
