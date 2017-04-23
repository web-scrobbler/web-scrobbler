'use strict';

/* global Connector, Util */

Connector.playerSelector = '#webplayer-region';

Connector.playButtonSelector = '.ico icon-play';

Connector.getArtistTrack = function() {
	var text = $('.track-name').attr('title');
	return Util.splitArtistTrack(text);
};
