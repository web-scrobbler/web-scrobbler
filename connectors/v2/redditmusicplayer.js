'use strict';

/* global Connector */

Connector.playerSelector = '.ui.controls';

Connector.currentTimeSelector = '.item.start.time';

Connector.getTrackArt = function () {
	return 'https:'+$('.ui.item.active img').attr('src');
};

Connector.getArtistTrack = function () {
	var text = $('.ui.item.active .title').text().replace(/ \[.*/, '');
	return Connector.splitArtistTrack(text);
};

Connector.isPlaying = function() {
	return $('.item.play.button').hasClass('active');
};

Connector.getUniqueID = function() {
	return $('.ui.item.active').attr('data-id');
};
