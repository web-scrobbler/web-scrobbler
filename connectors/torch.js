'use strict';

/* global Connector */

Connector.playerSelector = '#td_player';

Connector.artistSelector = '#artist';

Connector.trackSelector = '.album_track_song';

Connector.albumSelector = '.album';

Connector.currentTimeSelector = '.ytplayer-getCurrentTime()';

Connector.durationSelector = '#yt_time_duration';

Connector.trackArtImageSelector = '.album_cover_container';

Connector.isPlaying = function () {
	var playButtonImgFilename = $('#play-pause img').attr('src');
	return playButtonImgFilename.indexOf('pause') !== -1;
};
