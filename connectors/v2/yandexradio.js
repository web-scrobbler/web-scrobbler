'use strict';

/* global Connector */

Connector.playerSelector = '.page-station__bar';
Connector.trackArtImageSelector = '.slider__items > div:nth-child(3) .track__cover';
Connector.trackSelector = '.slider__items > div:nth-child(3) .track__title';
Connector.artistSelector = '.slider__items > div:nth-child(3) .track__artists';
Connector.isPlaying = function() {
	return $('body').hasClass('body_state_playing');
};
