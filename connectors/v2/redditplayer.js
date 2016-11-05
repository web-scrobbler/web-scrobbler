'use strict';

/* global Connector */

var INFO_CURRENT_TIME = 1;
var INFO_DURATION = 2;

Connector.playerSelector = 'body';

Connector.getArtistTrack = function () {
	var text = $('#portablecontrols h3').text().replace(' [ buffering... ]', '');
	var separator = this.findSeparator(text);

	var artist = null;
	var track = null;

	if (separator !== null) {
		artist = text.substr(0, separator.index);
		track = text.substr(separator.index + separator.length);
	}

	return {artist: artist, track: track};
};

Connector.getCurrentTime = function() {
	return getTimeInfo(INFO_CURRENT_TIME);
};

Connector.getDuration = function() {
	return getTimeInfo(INFO_DURATION);
};

Connector.isPlaying = function () {
	return $('.playing').length > 0;
};

Connector.isStateChangeAllowed = function() {
	return Connector.getCurrentTime() > 0;
};

function getTimeInfo(field) {
	var pattern = /(.+)\s-\s(.+)/gi;
	var songInfo = pattern.exec($('.elapsed').text());
	if (songInfo) {
		return  Connector.stringToSeconds(songInfo[field]);
	}
	return 0;
}
