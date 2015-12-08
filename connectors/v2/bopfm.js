'use strict';

/* global Connector */

Connector.playerSelector = '#bop-player';

Connector.getArtist = function () {
	var text = $('#bop-player div.current-song-section > div.song-info > div.artist > a').text().trim();
	return text || null;
};

Connector.trackSelector = '#bop-player div.current-song-section > div.song-info > div.title > a';

Connector.getTrackArt = function () {
	return $('.current-song-art').css('background-image').slice(4).slice(0,-1);
};

Connector.isPlaying = function () {
	return $('body').hasClass('song-playing');
};
