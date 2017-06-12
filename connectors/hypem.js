'use strict';

/* global Connector */

setupConnector();

function setupConnector() {
	if (isPremiere()) {
		setupPremierePlayer();
	} else {
		setupDefaultPlayer();
	}
}

function isPremiere() {
	return /^\/premiere\/.*/.test(window.location.pathname);
}

function setupPremierePlayer() {
	Connector.playerSelector = '.hype-player';

	Connector.artistSelector = '#album-header-artist';

	Connector.trackSelector = 'li.active .title';

	Connector.trackArtSelector = 'img#album-big';

	Connector.isPlaying = () => $('.hype-player').hasClass('playing');
}

function setupDefaultPlayer() {
	Connector.playerSelector = '#player-controls';

	Connector.artistSelector = '#player-nowplaying [href^="/artist/"]';

	Connector.trackSelector = '#player-nowplaying [href^="/track/"]';

	Connector.getTrackArt = () => {
		let backgroundImage = /url\((.+)\)/.exec($('.haarp-section-track.haarp-active').find('.thumb').attr('style'));
		if (backgroundImage !== null) {
			backgroundImage = backgroundImage[1];
		}

		return backgroundImage;
	};

	Connector.isPlaying = () => $('#playerPlay').hasClass('pause');
}
