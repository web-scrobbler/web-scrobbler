'use strict';

/* global Connector, Util */

Connector.playerSelector = '.album-tracks';

Connector.getArtistTrack = function () {
	var text = $('.play:contains("ll")').attr('download');
	return Util.splitArtistTrack(text);
};

Connector.isPlaying = function () {
	return $('.play:contains("ll")').length > 0;
};
