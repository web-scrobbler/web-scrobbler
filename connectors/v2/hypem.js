'use strict';

/* global Connector */

if (/^\/premiere\/.*/.test(window.location.pathname)) {

	Connector.playerSelector = '.hype-player';

	Connector.artistSelector = '#album-header-artist';

	Connector.trackSelector = 'li.active .title';

	Connector.trackArtImageSelector = 'img#album-big';

	Connector.isPlaying = function() {
		return $('.hype-player').hasClass('playing');
	};
} else {
	Connector.playerSelector = '#player-controls';

	Connector.artistSelector = '#player-nowplaying [href^="/artist/"]';

	Connector.trackSelector = '#player-nowplaying [href^="/track/"]';

	Connector.getTrackArt = function () {
		return /url\((.+)\)/.exec($('.haarp-section-track.haarp-active').find('.thumb').attr('style'))[1];
	};

	Connector.isPlaying = function() {
		return $('#playerPlay').hasClass('pause');
	};
}
