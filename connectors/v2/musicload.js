'use strict';

/* global Connector */

Connector.playerSelector = '.player-info-wrapper';

Connector.artistSelector = '.player-info-wrapper > .info > .title > span';

Connector.getTrackArt = function () {
	return location.origin+$('#player .element.active img').attr('src');
};

Connector.getTrack = function() {
	return $('.player-info-wrapper > .info > .title').contents().get(0).nodeValue;
};

Connector.getAlbum = function () {
	var text = $('.title[data-type="album"]').text().substring(7);
	return text || null;
};

Connector.isPlaying = function() {
	return ($('.control.play').css('display') === 'none');
};
