'use strict';

/* global Connector */

Connector.playerSelector = '#playPanel > .panel-inner';

Connector.artistSelector = '.artist';

Connector.trackSelector = '.songname';

Connector.isPlaying = function () {
	return !$('.play').hasClass('stop');
};
