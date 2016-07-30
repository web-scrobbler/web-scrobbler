'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.artistSelector = 'div.jp-player-artist > a';

Connector.trackSelector = 'div.jp-player-title > a';

Connector.playButtonSelector = '.jp-play';

Connector.getArtist = function() {
	var text = $(this.artistSelector).text().trim();
	return text || null;
};

Connector.getTrack = function() {
	var text = $(this.trackSelector).text().trim();
	return text || null;
};
