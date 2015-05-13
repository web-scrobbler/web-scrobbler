'use strict';

define([], function() {

	return {
		/*  If song has no cover art:
				1. try to identify it via the MusicBrainz API
				2. use the song's MusicBrainz ID to query CoverArtArchive.org
				3. check if the CoverArt is actually a useable HTTP resource
		*/
		getCoverArt: function (song, cb) {
			if(song.metadata.artistThumbUrl) {
				console.log('Found album artwork via LastFM');
				cb();
			} else {
				// Get MusicBrainz ID
				$.get('http://musicbrainz.org/ws/2/release?query='+song.getTrack()+' '+song.getArtist()+'&fmt=json&limit=1')
					.done(function(musicbrainz) {
						var MBID = musicbrainz.releases[0].id;
						getCoverArtArchiveImg(MBID);
					})
					.fail(cb);

				function getCoverArtArchiveImg(MBID) {
					// Look for CoverArtArchive.org images with this ID
					$.ajax({url: 'http://coverartarchive.org/release/'+MBID+'/front', type:'HEAD' })
						.done(function() {
							console.log('Found album artwork via MusicBrainz/CoverArtArchive');
							song.metadata.artistThumbUrl = coverArtURL;
						})
						.always(cb);
				}
			}
		}
	};

});
