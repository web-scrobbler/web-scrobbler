'use strict';

Connector.playerSelector = '.player';

Connector.trackSelector = '.current-track .js-current-track-title';

Connector.durationSelector = '.current-track .js-current-track-duration';

Connector.currentTimeSelector = '.current-time.js-current-time';

Connector.playButtonSelector = '.track-controls .js-play-track';

Connector.getArtist = () => {
	return $('.current-track .js-current-track-artist').text().replace(' - ', '');
};

Connector.getAlbum = () => {
	let releasePath = $(Connector.trackSelector).attr('href');
	return $(`.track-list .track-release a[href="${releasePath}"]`).attr('title');
};
