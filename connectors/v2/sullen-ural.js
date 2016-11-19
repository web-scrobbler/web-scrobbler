'use strict';

/* global Connector */

Connector.playerSelector = '.album-tracks';

Connector.getArtistTrack = function () {
	var text = $('.play:contains("ll")').attr('download');
	return Connector.splitArtistTrack(text);
};

Connector.isPlaying = function () {
	return $('.play:contains("ll")').length > 0;
};
