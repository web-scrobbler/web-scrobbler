'use strict';

/* global Connector, Util */

Connector.playerSelector = 'body';

Connector.artistTrackSelector = '#portablecontrols h3';

Connector.isPlaying = function () {
	return $('.playing').length > 0;
};

Connector.getTimeInfo = function() {
	let text = $('.elapsed').text();
	return Util.splitTimeInfo(text, '-');
};
