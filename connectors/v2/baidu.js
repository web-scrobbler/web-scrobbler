'use strict';

/* global Connector */

Connector.playerSelector = '#playPanel > .panel-inner';

Connector.artistSelector = '.artist';

Connector.trackSelector = '.songname';

Connector.currentTimeSelector = '.curTime';

Connector.durationSelector = '.totalTime';

Connector.isPlaying = function () {
	return !$('.play').hasClass('stop');
};
