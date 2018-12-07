'use strict';

function setupConnector() {
	setupCommonProperties();

	if (isDesktopPlayer()) {
		setupDesktopPlayer();
	} else {
		setupMobilePlayer();
	}
}

function setupCommonProperties() {
	Connector.playButtonSelector = '.icon-play';

	Connector.currentTimeSelector = '.time';
}

function isDesktopPlayer() {
	return $('#app-container').length > 0;
}

function setupDesktopPlayer() {
	Connector.getUniqueID = () => $('.current .fav').attr('id');

	Connector.playerSelector = '.pl-controls .container';

	Connector.trackSelector = '.current .title';

	Connector.artistSelector = '.pl-artist';
}

function setupMobilePlayer() {
	Connector.playerSelector = '.pla-wrapper';

	Connector.getArtistTrack = () => {
		let text = $('.song-title>div>div:nth-child(1)').text();
		return Util.splitArtistTrack(text, '-', true);
	};
}

setupConnector();
