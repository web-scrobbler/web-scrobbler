'use strict';

/* global Connector */

Connector.playerSelector = '#markup';

Connector.artistSelector = '.artist';

Connector.trackSelector = '.title';

Connector.currentTimeSelector = '.progress-texts span:nth-child(1)';

Connector.durationSelector = '.progress-texts span:nth-child(3)';

Connector.isPlaying = function() {
	return $('#control-bar').hasClass('state-playing');
};

Connector.isStateChangeAllowed = function() {
	return Connector.getCurrentTime() > 0;
};

Connector.getUniqueID = function() {
	return $('meta[property="og:ytid"]').attr('content');
};
