export {};

function setupConnector() {
	if (isMobilePlayer()) {
		setupMobilePlayer();
	} else {
		setupDesktopPlayer();
	}
}

function isMobilePlayer() {
	return Boolean(document.querySelector('#appbar'));
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
		const text = Util.getTextFromSelectors('h3>span');
		return text?.split('Icon Angle right')[0];
	};

	Connector.trackArtSelector =
		'#app > div > div:nth-child(2) > div:nth-child(3)';

	Connector.getUniqueID = () => {
		const text = Util.getAttrFromSelectors('h1 > a', 'href');
		return text?.split('/').at(-2);
	};
}

setupConnector();
