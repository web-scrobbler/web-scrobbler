'use strict';

Connector.playerSelector = '.player';

Connector.playButtonSelector = '.track-controls .player-button.play-track';

Connector.trackSelector = '.current-track .js-current-track-title';

Connector.durationSelector = '.current-track .js-current-track-duration';

Connector.getArtist = function() {
	return $('.current-track .js-current-track-artist').text().replace(' - ', '');
};
