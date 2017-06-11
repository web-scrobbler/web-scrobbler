'use strict';

Connector.playerSelector = '#player_controls';

Connector.artistTrackSelector = '#song_info_panel span.song_name';

Connector.artistSelector = '#song_info_panel span.artist_name';

Connector.trackSelector = '#song_info_panel span.song_name';

Connector.currentTimeSelector = '#mp3_position';

Connector.durationSelector = '#mp3_duration';

Connector.playButtonSelector = '#mp3_play .fa-play';

Connector.albumSelector = '#album_panel .hide-for-small-only .album_name';

Connector.trackArtImageSelector = '#artwork_panel img';

Connector.onReady = function(){
	jQuery(document).on("page:load", function(event) {
		console.log('page:load event happend, wait for new song to load');
		window.WaitUntilSongLoads = function(){
			if ($("#player_spinner").is(":visible")) {
				console.log('waiting for song to load...');
		          setTimeout(WaitUntilSongLoads, 500);
		      } else {
		          Connector.onStateChanged();
		      }
		};
		WaitUntilSongLoads();
	});
};
