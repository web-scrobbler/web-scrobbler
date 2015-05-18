'use strict';

/* global Connector */

Connector.playerSelector = '#currentSong';

Connector.artistSelector = '#currentSong .artist_name';

Connector.trackSelector = '#currentSong .song-details';

var timeRegex = /(\d+:\d+)\s\/\s(\d+:\d+)/;

/**
 * Helper method to parse time elapsed (currentTime) and total duration
 *
 * @returns {{currentTime, duration}} both in seconds
 */
var parseTime = function() {
	var result = timeRegex.exec($('#currentSong .display-track-time').text()),
		currentTime = null, duration = null;
	if (result) {
		currentTime = Connector.stringToSeconds(result[1]);
		duration = Connector.stringToSeconds(result[2]);
	}
	return {currentTime: currentTime, duration: duration};
};

Connector.getDuration = function () {
	return parseTime().duration;
};

Connector.getCurrentTime = function () {
	return parseTime().currentTime;
};

Connector.getUniqueID = function () {
	return $('#currentSong .commontrack').attr('data-track-id') || null;
};

Connector.isPlaying = function () {
	return $('#currentSong .commontrack').hasClass('active');
};
