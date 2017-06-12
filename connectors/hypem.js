'use strict';

/* global Connector, Util */

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
		let styleProperty = $('.thumb').attr('style');
		return Util.extractUrlFromCssProperty(styleProperty);
	};

	Connector.getUniqueID = () => {
		let trackUrl = $('#player-nowplaying [href^="/track/"]').attr('href');
		if (trackUrl) {
			return trackUrl.split('/').pop();
		}
		return null;
	};

	Connector.isPlaying = () => $('#playerPlay').hasClass('pause');
}
