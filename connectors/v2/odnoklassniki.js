'use strict';

/* global Connector */

var INFO_CURRENT_TIME = 1;
var INFO_DURATION = 2;

Connector.playerSelector = 'body';

Connector.artistSelector = '.mus_player_artist';

Connector.trackSelector = '.mus_player_song';

Connector.getCurrentTime = function() {
	return getTimeInfo(INFO_CURRENT_TIME);
};

Connector.getDuration = function() {
	return getTimeInfo(INFO_DURATION);
};

Connector.isPlaying = function () {
	return $('#topPanelMusicPlayerControl').hasClass('toolbar_music-play__active');
};

function getTimeInfo(field) {
	var pattern = /(.+)\s\/\s(.+)/gi;
	var songInfo = pattern.exec($('.mus_player_time').text());
	if (songInfo) {
		return  Connector.stringToSeconds(songInfo[field]);
	}
	return 0;
}
