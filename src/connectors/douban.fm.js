'use strict';

function setupConnector() {
	if (isMobilePlayer()) {
		setupMobilePlayer();
	} else {
		setupDesktopPlayer();
	}
}

function isMobilePlayer() {
	return $('#appbar').length > 0;
}

function setupDesktopPlayer() {
	Connector.playerSelector = '.player-wrapper';

	Connector.trackArtSelector = '.playing-cover img';

	Connector.trackSelector = '.middle>div:nth-child(2)>a';

	Connector.artistSelector = '.middle>div:nth-child(3) a';

	Connector.playButtonSelector = 'label[title="播放"]';
}

function setupMobilePlayer() {
	Connector.playerSelector = '#app';

	Connector.playButtonSelector = 'svg>path';

	Connector.trackSelector = 'h1 a';

	Connector.getArtist = () => {
		let text = $('h3>span').text();
		return text.split('Icon Angle right').shift();
	};

	Connector.trackArtSelector = '#app > div > div:nth-child(2) > div:nth-child(3)';

	Connector.getUniqueID = () => {
		let text = $('h1 > a').attr('href');
		return text.split('/').slice(-2).shift();
	};
}

setupConnector();
