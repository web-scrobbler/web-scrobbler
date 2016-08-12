'use strict';

/* global Connector */

Connector.playerSelector = '.player';

Connector.trackSelector = '.p-info-display > a';

Connector.artistSelector = '.p-artist';

Connector.currentTimeSelector = '.current-p-time';

Connector.durationSelector = '.full-p-time';

Connector.isPlaying = function() {
	return $('a.as-icon.as-icon-play').hasClass('ng-hide');
};

Connector.getUniqueID = function (	) {
	var text = $('.p-info-display > a').attr('href');
	return text.length > 8 ? text.substring(8) : null;
};
