'use strict';

/* global Connector */

Connector.playerSelector = '.joli-music-player';

Connector.artistSelector = 'span.artist';

Connector.trackSelector = 'span.title';

Connector.getTrackArt = function () {
	var src = $('.image img').attr('src');
	return src.startsWith('//') ? src = 'https:'+src : src;
};

Connector.isPlaying = function () {
	return !$('.joli-music-player').hasClass('pause');
};
