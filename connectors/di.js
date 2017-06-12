'use strict';

/* global Connector, Util */

Connector.playerSelector = '#webplayer-region';

Connector.playButtonSelector = '.ico icon-play';

Connector.timeInfoSelector = '.timecode';

Connector.getArtistTrack = () => {
	let text = $('.track-name').attr('title');
	return Util.splitArtistTrack(text);
};
