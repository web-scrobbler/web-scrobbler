'use strict';

/* global Connector */

Connector.playerSelector = 'body';

Connector.artistSelector = '.artist';

Connector.trackSelector = '.title';

Connector.playButtonSelector = '.play';

Connector.getTrackArt = function() {
	let relativeTrackArtUrl = $('.artist-img img').attr('src');
	return `http://www.pinguinplayer.com/${relativeTrackArtUrl}`;
};
