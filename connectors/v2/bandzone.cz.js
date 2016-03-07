'use strict';

/* global Connector */

if (location.href === 'http://bandzone.cz/' || location.href === 'https://bandzone.cz/') {
	Connector.playerSelector = '#stats';

	Connector.getArtist = function () {
		var text = $('.stat:has(.ui-miniaudioplayer-state-playing) h4').text().trim();
		return text || null;
	};

	Connector.getTrack = function () {
		var text = $('.stat:has(.ui-miniaudioplayer-state-playing) .songTitle').text().trim();
		return text || null;
	};

	Connector.isPlaying = function () {
		return $('.ui-miniaudioplayer-state-playing').length;
	};
} else {
	Connector.playerSelector = '#playerWidget';

	Connector.getArtist = function () {
		var text = $('.profile-name h1').text().replace($('.profile-name span').text(), '').trim();
		return text || null;
	};

	Connector.trackSelector = '.ui-state-active .ui-audioplayer-song-title';

	Connector.isPlaying = function () {
		return $('.ui-audioplayer-button').text() === 'stop';
	};

	Connector.getCurrentTime = function() {
		var currentTimeStr = getSongInfo(INFO_CURRENT_TIME);
		return Connector.stringToSeconds(currentTimeStr);
	};

	Connector.getDuration = function() {
		var durationStr = getSongInfo(INFO_DURATION);
		return Connector.stringToSeconds(durationStr);
	};

	var INFO_CURRENT_TIME = 1;
	var INFO_DURATION = 2;
	var getSongInfo = function(field) {
		var infoStr = $('.ui-audioplayer-time').text();
		var pattern = /(.+)\s\/\s(.+)/gi;
		return pattern.exec(infoStr)[field];
	};
}
