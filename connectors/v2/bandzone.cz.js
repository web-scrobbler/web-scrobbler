'use strict';

/* global Connector, MetadataFilter */

if (location.href === 'http://bandzone.cz/' || location.href === 'https://bandzone.cz/') {
	Connector.playerSelector = '#stats';

	Connector.artistSelector = '.stat:has(.ui-miniaudioplayer-state-playing) h4';

	Connector.trackSelector = '.stat:has(.ui-miniaudioplayer-state-playing) .songTitle';

	Connector.isPlaying = function () {
		return $('.ui-miniaudioplayer-state-playing').length;
	};
} else {
	Connector.playerSelector = '#playerWidget';

	Connector.artistSelector = '.profile-name h1';

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

	Connector.isStateChangeAllowed = function() {
		return Connector.getDuration() > 0;
	};

	var removeGenre = function(text) {
		var genre = $('.profile-name span').text();
		return text.replace(genre, '');
	};

	Connector.filter = new MetadataFilter({
		all: MetadataFilter.trim,
		artist: removeGenre
	});

	var INFO_CURRENT_TIME = 1;
	var INFO_DURATION = 2;
	var getSongInfo = function(field) {
		var infoStr = $('.ui-audioplayer-time').text();
		var pattern = /(.+)\s\/\s(.+)/gi;
		return pattern.exec(infoStr)[field];
	};
}
