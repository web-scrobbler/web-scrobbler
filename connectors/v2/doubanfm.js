'use strict';

/* global Connector */

Connector.playerSelector = '.player-wrapper';

Connector.trackArtImageSelector = '.playing-cover img';

Connector.getTrack = function() {
	return $('.player-wrapper .middle>div:nth-child(2) a').first().text();
};

Connector.getArtist = function() {
	return $('.player-wrapper .link.artist-name').first().text();
};

Connector.getDuration = function () {
	var text = $('.time').text();
	return Connector.stringToSeconds(text.substring(1)) || null;
};

Connector.isPlaying = function () {
	return $('.player-wrapper .buttons .icon-pause').length > 0;
};
