'use strict';

/* global Connector */

Connector.playerSelector = '.ui.controls';

Connector.currentTimeSelector = '.item.start.time';

Connector.trackArtImageSelector = '.ui.item.active img';

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
