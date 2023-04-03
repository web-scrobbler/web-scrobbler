export {};

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
	return Boolean(document.querySelector('#app-container'));
}

function setupDesktopPlayer() {
	Connector.getUniqueID = () =>
		Util.getAttrFromSelectors('.current .fav', 'id');

	Connector.playerSelector = '.pl-controls .container';

	Connector.trackSelector = '.current .title';

	Connector.artistSelector = '.pl-artist';
}

function setupMobilePlayer() {
	Connector.playerSelector = '.pla-wrapper';

	Connector.getArtistTrack = () => {
		const text = Util.getTextFromSelectors(
			'.song-title>div>div:nth-child(1)'
		);
		return Util.splitArtistTrack(text, ['-'], true);
	};
}

setupConnector();
