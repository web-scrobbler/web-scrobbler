'use strict';

/* global Connector */

Connector.playerSelector = '#player-controls';

Connector.artistTrackSelector = '.current-track-title > span';

Connector.currentTimeSelector = '#current-progress';

Connector.isPlaying = function() {
	return $('div.controls > i.fa.fa-play').hasClass('fa-pause');
};

Connector.getUniqueID = function() {
	return $('#current-track > div.current-track-title > span').attr('href');
};
