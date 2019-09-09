'use strict';

Connector.playerSelector = '#app';

Connector.artistSelector = '.player-song-artist';

Connector.trackSelector = '.player-song-title';

Connector.isPlaying = () => {
	return $('#audio-player').attr('src') !== undefined;
};
