'use strict';

/* global Connector, Util */

Connector.playerSelector = '.player-wrapper';

Connector.trackArtSelector = '.playing-cover img';

Connector.getTrack = function() {
	return $('.player-wrapper .middle>div:nth-child(2) a').first().text();
};

Connector.getArtist = function() {
	return $('.player-wrapper .link.artist-name').first().text();
};

Connector.getDuration = function () {
	var text = $('.time').text();
	return Util.stringToSeconds(text.substring(1));
};

Connector.isPlaying = function () {
	return $('.player-wrapper .buttons .icon-pause').length > 0;
};
