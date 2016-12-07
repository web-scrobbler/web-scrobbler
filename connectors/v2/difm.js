'use strict';

/* global Connector */

Connector.playerSelector = '#webplayer-region';

Connector.playButtonSelector = '.ico icon-play';

Connector.getArtistTrack = function() {
	var text = $('.track-name').attr('title');
	return Connector.splitArtistTrack(text);
};
