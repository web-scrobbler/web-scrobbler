'use strict';

/* global Connector */

Connector.playerSelector = '.ui.controls';

Connector.currentTimeSelector = '.item.start.time';

Connector.getTrackArt = function () {
	return 'https:'+$('.ui.item.active img').attr('src');
};

Connector.getArtistTrack = function () {
	var text = $('.ui.item.active .title').text().replace(/ \[.*/, '');
	var separator = this.findSeparator(text);

	var artist = null;
	var track = null;

	if (separator !== null) {
		artist = text.substr(0, separator.index);
		track = text.substr(separator.index + separator.length);
	}

	return {artist: artist, track: track};
};

Connector.isPlaying = function() {
	return $('.item.play.button').hasClass('active');
};

Connector.getUniqueID = function() {
	return $('.ui.item.active').attr('data-id');
};
