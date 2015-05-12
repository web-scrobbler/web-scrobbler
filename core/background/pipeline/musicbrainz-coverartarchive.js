'use strict';

define([], function() {

	return {
		/*  If song has no cover art:
				1. try to identify it via the MusicBrainz API
				2. use the song's MusicBrainz ID to query CoverArtArchive.org
				3. check if the CoverArt is actually a useable HTTP resource
		*/
		getCoverArt: function (song, cb) {
			if(!song.metadata.artistThumbUrl) {
				$.get('http://musicbrainz.org/ws/2/release?query='+song.getTrack()+' '+song.getArtist()+'&fmt=json&limit=1')
					.done(function(musicbrainz) {
						var MBID = musicbrainz.releases[0].id;
						var coverArtURL = 'http://coverartarchive.org/release/'+MBID+'/front';

						$.ajax({url: coverArtURL, type:'HEAD' })
							.done(function() {
								song.metadata.artistThumbUrl = coverArtURL;
								console.log('Found MUSICBRAINZ album artwork');
							})
							.fail(function() {
								console.log('Couldn\'t find any artwork :(');
							})
							.always(function() {
								cb();
							});
					})
					.fail(function() {
						console.log('Couldnae get MusicBrainz ID for song');
						cb();
					});
			} else {
				console.log('Found album artwork via LastFM');
				cb();
			}
		}
	};

});
