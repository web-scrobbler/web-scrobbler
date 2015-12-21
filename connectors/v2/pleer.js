'use strict';

/* global Connector */

var INFO_CURRENT_TIME = 1;
var INFO_ARTIST = 2;
var INFO_TITLE = 3;
var INFO_DURATION = 4;

Connector.playerSelector = '#player';

Connector.getArtist = function() {
	return getSongInfo(INFO_ARTIST);
};

Connector.getTrack = function() {
	return getSongInfo(INFO_TITLE);
};

Connector.getDuration = function() {
	var durationStr = getSongInfo(INFO_DURATION);
	return Connector.stringToSeconds(durationStr);
};

Connector.getCurrentTime = function() {
	var currentTimeStr = getSongInfo(INFO_CURRENT_TIME);
	return Connector.stringToSeconds(currentTimeStr);
};

Connector.isPlaying = function() {
	var duration = Connector.getDuration();
	// Zero duration means song is unable to be played.
	return duration && $('#play').hasClass('pause');
};

Connector.getUniqueID = function() {
	return $('#player').attr('file_id');
};

/* Extract the information field from the whole string,
 * e.g. '00:01 deadmau5 & Kaskade — I Remember (03:51)'.
 */
function getSongInfo(field) {
	var pattern = /(.+?)\s(.+)\s—\s(.+)\s\(([^)]+)\)/gi;
	return pattern.exec($('.now-playing').text())[field];
}
