'use strict';

setupConnector();

function setupConnector() {
	if (isMainPage()) {
		setupMainPagePlayer();
	} else {
		setupDefaultPlayer();
	}
}

function isMainPage() {
	return location.href === 'http://bandzone.cz/' ||
		location.href === 'https://bandzone.cz/';
}

function setupMainPagePlayer() {
	Connector.playerSelector = '#stats';

	Connector.artistSelector = '.stat:has(.ui-miniaudioplayer-state-playing) h4';

	Connector.trackSelector = '.stat:has(.ui-miniaudioplayer-state-playing) .songTitle';

	Connector.isPlaying = () => $('.ui-miniaudioplayer-state-playing').length > 0;
}

function setupDefaultPlayer() {
	Connector.playerSelector = '#playerWidget';

	Connector.artistSelector = '.profile-name h1';

	Connector.trackSelector = '.ui-state-active .ui-audioplayer-song-title';

	Connector.timeInfoSelector = '.ui-audioplayer-time';

	Connector.isPlaying = () => $('.ui-audioplayer-button').text() === 'stop';

	Connector.filter = new MetadataFilter({
		all: MetadataFilter.trim,
		artist: removeGenre
	});

	function removeGenre(text) {
		let genre = $('.profile-name span').text();
		return text.replace(genre, '');
	}
}
