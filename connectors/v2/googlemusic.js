
Connector.playerSelector = '#player';

Connector.artistSelector = '#player-artist';

Connector.trackSelector = '#playerSongTitle';

Connector.albumSelector = '#playerSongInfo .player-album';

Connector.currentTimeSelector = '#time_container_current';

Connector.isPlaying = function() {
	return $('#player button[data-id="play-pause"]').hasClass('playing');
};
