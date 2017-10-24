'use strict';

Connector.artistSelector = '.track-artist';

Connector.trackSelector = '.track-title';

Connector.currentTimeSelector = '.position';

Connector.playButtonSelector = '.play-pause-button.paused';

Connector.playerSelector = '#player > ul';

Connector.getTrackArt = () => {
	// Remove image resize parameter
	return $('.cover-art > img').attr('src').split('&')[0];
};
