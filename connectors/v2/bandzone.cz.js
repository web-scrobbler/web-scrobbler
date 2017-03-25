'use strict';

/* global Connector, MetadataFilter */

if (location.href === 'http://bandzone.cz/' || location.href === 'https://bandzone.cz/') {
	Connector.playerSelector = '#stats';

	Connector.artistSelector = '.stat:has(.ui-miniaudioplayer-state-playing) h4';

	Connector.trackSelector = '.stat:has(.ui-miniaudioplayer-state-playing) .songTitle';

	Connector.isPlaying = function () {
		return $('.ui-miniaudioplayer-state-playing').length > 0;
	};
} else {
	Connector.playerSelector = '#playerWidget';

	Connector.artistSelector = '.profile-name h1';

	Connector.trackSelector = '.ui-state-active .ui-audioplayer-song-title';

	Connector.timeInfoSelector = '.ui-audioplayer-time';

	Connector.isPlaying = function () {
		return $('.ui-audioplayer-button').text() === 'stop';
	};

	var removeGenre = function(text) {
		var genre = $('.profile-name span').text();
		return text.replace(genre, '');
	};

	Connector.filter = new MetadataFilter({
		all: MetadataFilter.trim,
		artist: removeGenre
	});
}
