'use strict';

/* global Connector */

Connector.playerSelector = '.player';

Connector.trackSelector = '.p-info-display > a';

Connector.artistSelector = '.p-artist';

Connector.getCurrentTime = function() {
	return $('span.p-time.ng-binding').text().split('/')[0].trim();
};

Connector.isPlaying = function() {
	return !$('a.as-icon.as-icon-pause').hasClass('ng-hide');
};

Connector.getUniqueID = function (	) {
	var text = $('.p-info-display > a').attr('href');
	return text.length > 8 ? text.substring(8) : null;
};
