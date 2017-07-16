'use strict';

Connector.playerSelector = 'body';

Connector.artistSelector = '.artist';

Connector.trackSelector = '.title';

Connector.playButtonSelector = '.play';

Connector.getTrackArt = () => {
	let relativeTrackArtUrl = $('.artist-img img').attr('src');
	return `http://www.pinguinplayer.com/${relativeTrackArtUrl}`;
};
