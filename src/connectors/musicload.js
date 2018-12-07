'use strict';

Connector.playerSelector = '.player-info-wrapper';

Connector.artistSelector = '.player-info-wrapper > .info > .title > span';

Connector.getTrackArt = () => {
	return location.origin + $('#player .element.active img').attr('src');
};

Connector.getTrack = () => {
	return $('.player-info-wrapper > .info > .title').contents().get(0).nodeValue;
};

Connector.getAlbum = () => {
	return $('.title[data-type="album"]').text().substring(7);
};

Connector.isPlaying = () => {
	return ($('.control.play').css('display') === 'none');
};
