'use strict';

define([], function() {

	// NB:
	// Could potentially split `getMusicBrainzId()` and `getCoverArtArchive()` into consecutive pipeline modules,
	// if we can come up with other uses for the MusicBrainz data.

	var service = {
		getCoverArt: function(song, cb) {
			// Only query APIs if no cover art can be found
			if (song.parsed.trackArt) {
				console.log('Using local/parsed artwork');
				cb();
			} else if (song.metadata.artistThumbUrl) {
				console.log('Found album artwork via LastFM');
				cb();
			} else {
				console.log('Looking for album artwork via MusicBrainz');

				// Search both, just incase there's artwork for the album, but not for the song/single
				var endpoints = ['release', 'release-group'];

				var coverArtSearch = function() {
					if (endpoints.length < 1) {
						return cb();
					}

					var endpoint = endpoints.shift();
					// Try to ID the song via the MusicBrainz API
					service.getMusicBrainzId(endpoint, song, coverArtSearch, function() {
						// then Check for CoverArtArchive imagery against that MusicBrainz ID
						service.getCoverArtArchive(song, coverArtSearch, cb);
					});
				};

				coverArtSearch();
			}
		},

		/* Get track or album MusicBrainz ID
			* Search API docs:
				http://musicbrainz.org/doc/Development/XML_Web_Service/Version_2/Search
			* Query syntax docs:
				https://lucene.apache.org/core/4_3_0/queryparser/org/apache/lucene/queryparser/classic/package-summary.html#package_description
		*/
		getMusicBrainzId: function(endpoint, song, onFailure, onSuccess) {
			$.get('http://musicbrainz.org/ws/2/' + endpoint + '?fmt=json&query=' +
					'title:' +
					'+"' + song.getTrack() + '"^3 ' + // bias towards the exact string
					song.getTrack() + ' ' + // and individual words

					'artistname:' +
					'+"' + song.getArtist() + '"^4' +
					song.getArtist() + ' '
				)
				.done(function(musicbrainz) {
					if (musicbrainz.count === 0) {
						return onFailure();
					}

					var results = musicbrainz[endpoint + 's'];
					var MBID = results[0].id;
					song.metadata.musicBrainzId = MBID;

					(typeof onSuccess === 'function' ? onSuccess : onFailure)(MBID);
				})
				.fail(onFailure);
		},

		// Requires song.metadata.musicBrainzId to have been previously retrieved
		getCoverArtArchive: function(song, onFailure, onSuccess) {
			var coverArtUrl = 'http://coverartarchive.org/release/' + song.metadata.musicBrainzId + '/front';

			$.ajax({
				url: coverArtUrl,
				type: 'HEAD' // Check if the CoverArt is actually a useable HTTP resource; prevents Chrome errors
			})
				.done(function() {
					console.log('Found album artwork via MusicBrainz');
					song.metadata.attr('artistThumbUrl', coverArtUrl);

					(typeof onSuccess === 'function' ? onSuccess : onFailure)(coverArtUrl);
				})
				.fail(onFailure);
		}
	};

	return service;
});
