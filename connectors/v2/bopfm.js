'use strict';

/* global Connector */

Connector.playerSelector = '#bop-player';

Connector.artistSelector = '#bop-player div.current-song-section > div.song-info > div.artist > a';

Connector.trackSelector = '#bop-player div.current-song-section > div.song-info > div.title > a';

Connector.isPlaying = function() {
	return $('body').hasClass('song-playing');
};
