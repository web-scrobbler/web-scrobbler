'use strict';

define([], function() {

	var service = {
		getCoverArt: function(song, cb) {
			// Only query APIs if no cover art can be found
			if (song.metadata.artistThumbUrl) {
				console.log('Found album artwork via LastFM');
				cb();
			} else {
				console.log('Looking for album artwork via MusicBrainz');
				// Try to ID the song via the MusicBrainz API
				service.getMusicBrainzId(song, cb, function() {
					// then Check for CoverArtArchive imagery against that MusicBrainz ID
					service.getCoverArtArchive(song, cb);
				});
			}
		},

		// NB:
		// Could potentially split `getMusicBrainzId()` and `getCoverArtArchive()` into consecutive pipeline modules,
		// if we can come up with other uses for the MusicBrainz data.

		getMusicBrainzId: function(song, onFailure, onSuccess) {
			// Get MusicBrainz ID
			// Search API docs: http://musicbrainz.org/doc/Development/XML_Web_Service/Version_2/Search
			$.get('http://musicbrainz.org/ws/2/release?query=' +
				'title:' + song.getTrack() +
				' AND ' +
				'artist:' + song.getArtist() +
				'&fmt=json&limit=1'
			)
				.done(function(musicbrainz) {
					var MBID = musicbrainz.releases[0].id;
					song.metadata.musicBrainzId = MBID;
					(typeof onSuccess === 'function' ? onSuccess : onFailure)(MBID);
				})
				.fail(onFailure);
		},

		getCoverArtArchive: function(song, onFailure, onSuccess) {
			// Look for CoverArtArchive.org images with this ID
			var coverArtUrl = 'http://coverartarchive.org/release/' + song.metadata.musicBrainzId + '/front';
			$.ajax({
					url: coverArtUrl,
					type: 'HEAD' // Check if the CoverArt is actually a useable HTTP resource; prevents Chrome errors
				})
				.done(function() {
					console.log('Found album artwork via MusicBrainz');
					song.metadata.artistThumbUrl = coverArtUrl;
					(typeof onSuccess === 'function' ? onSuccess : onFailure)(coverArtUrl);
				})
				.fail(onFailure);
		}
	};

	return service;
});
