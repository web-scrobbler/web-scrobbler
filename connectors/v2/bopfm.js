'use strict';

/* global Connector */

Connector.playerSelector = '#bop-player';

Connector.getArtist = function () {
	var text = $('#bop-player div.current-song-section > div.song-info > div.artist > a').text().trim();
	return text || null;
};

Connector.trackSelector = '#bop-player div.current-song-section > div.song-info > div.title > a';

Connector.isPlaying = function () {
	return $('body').hasClass('song-playing');
};
