'use strict';

/* global Connector */

Connector.playerSelector = '.player';

Connector.trackSelector = '.p-song-info > a';

Connector.getArtist = function () {
	var text = $('.p-artist').text();
	return text.length !== 0 ? text.substring(2) : null;
};

Connector.getCurrentTime = function() {
	return $('span.p-time.ng-binding').text().split('/')[0].trim();
};

Connector.isPlaying = function() {
	return !$('a.as-icon.as-icon-play').hasClass('ng-hide');
};

Connector.getUniqueID = function (	) {
	var text = $('.p-song-info > a').attr('href');
	return text.length > 8 ? text.substring(8) : null;
};
