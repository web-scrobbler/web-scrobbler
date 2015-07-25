'use strict';

/* global Connector */

Connector.playerSelector = '.page-station__bar';
Connector.trackSelector = '.slider__items > div:nth-child(3) .track__title a';
Connector.artistSelector = '.slider__items > div:nth-child(3) .track__artists a';
Connector.isPlaying = function() {
	return $('body').hasClass('body_state_playing');
};
