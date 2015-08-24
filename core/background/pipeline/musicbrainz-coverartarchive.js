'use strict';

define([], function() {

	// NB:
	// Could potentially split `getMusicBrainzId()` and `getCoverArtArchive()` into consecutive pipeline modules,
	// if we can come up with other uses for the MusicBrainz data.

	var service = {
		getCoverArt: function(song, cb) {
			// Only query APIs if no cover art can be found
			if (song.metadata.coverArtURL) {
				console.info('Found album artwork via LastFM');
				cb();
			} else {
				console.info('Looking for album artwork via MusicBrainz');

				// # 1. Identify the list of MBIDs (track, artist, album) to look through
				var MBIDs = ['trackMBID','albumMBID','artistMBID'];
				var searchableMBIDs = [];

				for (var id in MBIDs){
					var thisMBID = song.metadata[MBIDs[id]];
					if (song.metadata[MBIDs[id]]) {
						searchableMBIDs.push(thisMBID);
					}
				}

				// # 1.1. If no MBIDs, then manually fetch MBIDs
				var manualMBIDSearch = function(callback) {
					if(musicBrainzEndpoints.length > 0) {
						var guessEndpoint = musicBrainzEndpoints.shift();
						// Try to ID the song via the MusicBrainz API
						service.getMusicBrainzId(guessEndpoint, song, manualMBIDSearch, callback);
					} else {
						return cb(false);
					}
				};

				// # 2. Sift through artwork using accumulated MBIDs
				var loopThroughMBIDs = function(callback) {
					if(searchableMBIDs.length > 0) {
						var MBID = searchableMBIDs.shift();
						// then Check for CoverArtArchive imagery against that MusicBrainz ID
						service.getCoverArtArchive(MBID, loopThroughMBIDs, callback);
					} else {
						return cb(false);
					}
				};

				var findArt = function() {
					console.info('Searching CoverArtArchive with MBIDs',searchableMBIDs);
					loopThroughMBIDs(function(url) {
						console.info('Found cover artwork via CoverArtArchive');
						song.metadata.attr('coverArtURL', url);
						return cb(true);
					});
				};

				if(searchableMBIDs.length < 1) {
					console.info('Track has no last.fm MBID data; searching manually for an MBID');
					// Search both, just incase there's artwork for the album, but not for the song/single
					var musicBrainzEndpoints = ['release','release-group'];

					manualMBIDSearch(function(MBID) {
						console.info('Guessed an MBID for this track: ', MBID);
						song.metadata.attr('guessedMBID', MBID);
						searchableMBIDs.push(MBID);

						findArt();
					});
				} else {
					findArt();
				}
			}
		},

		/* Get track or album MusicBrainz ID
		* Search API docs:
		http://musicbrainz.org/doc/Development/XML_Web_Service/Version_2/Search
		* Query syntax docs:
		https://lucene.apache.org/core/4_3_0/queryparser/org/apache/lucene/queryparser/classic/package-summary.html#package_description
		*/
		getMusicBrainzId: function(guessEndpoint, song, onFailure, onSuccess) {
			$.get('http://musicbrainz.org/ws/2/' + guessEndpoint + '?fmt=json&query=' +
				'title:'+
				'+"' + song.getTrack() + '"^3 ' + // bias towards the exact string
				song.getTrack() + ' ' + // and individual words
				'artistname:'+
				'+"' + song.getArtist() + '"^4' +
				song.getArtist() + ' '
			)
			.done(function(musicbrainz) {
				if (musicbrainz.count === 0) {
					return onFailure();
				}

				var results = musicbrainz[guessEndpoint + 's'];
				var MBID = results[0].id;
				(typeof onSuccess === 'function' ? onSuccess : onFailure)(MBID);
			})
			.fail(onFailure);
		},

		// Requires song.metadata.mbid to have been previously retrieved
		getCoverArtArchive: function(MBID, onFailure, onSuccess) {
			var coverArtUrl = 'http://coverartarchive.org/release/' + MBID + '/front';

			$.ajax({
				url: coverArtUrl,
				type: 'HEAD' // Check if the CoverArt is actually a useable HTTP resource; prevents Chrome errors
			})
			.done(function() {
				(typeof onSuccess === 'function' ? onSuccess : onFailure)(coverArtUrl);
			})
			.fail(onFailure);
		}
	};

	return service;
});
