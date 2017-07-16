'use strict';

Connector.artistSelector = '.track-artist';

Connector.trackSelector = '.track-title';

Connector.currentTimeSelector = '.position';

Connector.durationSelector = '.duration';

Connector.playButtonSelector = '.play-pause-button.paused';

Connector.playerSelector = '#player > ul';

Connector.getTrackArt = function () {
	// Remove image resize parameter
	return $('.cover-art > img').attr('src').split('&')[0];
};
