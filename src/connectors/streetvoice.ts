export {};

function setupConnector() {
	if (isMobilePlayer()) {
		setupMobilePlayer();
	} else {
		setupDesktopPlayer();
	}
	setupCommonProperties();
}

function isMobilePlayer() {
	return Boolean(document.querySelector('#react-mobile-search'));
}

function setupDesktopPlayer() {
	Connector.playerSelector = '.now-playing';

	Connector.trackArtSelector = '.now-playing img';

	Connector.trackSelector = '.now-playing h4';

	Connector.artistSelector = '.now-playing h5';

	Connector.pauseButtonSelector = '.pause';
}

function setupMobilePlayer() {
	if (isListPlayer()) {
		setupListPlayer();
	} else {
		setupSinglePlayer();
	}

	Connector.pauseButtonSelector = '.playing button';
}

function isListPlayer() {
	return Boolean(document.querySelector('#item_box_list'));
}

function setupSinglePlayer() {
	Connector.playerSelector = '#react-player-wrapper';

	Connector.trackArtSelector = '.cover-block img';

	Connector.trackSelector = 'h1';

	Connector.artistSelector = '.user-info h4';

	Connector.albumSelector = '.cover-block~h5:nth-child(4)';
}

function setupListPlayer() {
	Connector.playerSelector = '.play,.playing';

	Connector.trackSelector = '.play,.playing .work-item-info h4';

	Connector.artistSelector = '.play,.playing h5';
}

function setupCommonProperties() {
	Connector.currentTimeSelector = `${Connector.playerSelector} .text-left`;

	Connector.durationSelector = `${Connector.playerSelector} .text-right`;

	Connector.getUniqueID = () => {
		return Util.getAttrFromSelectors(
			`${Connector.playerSelector} button[data-id]`,
			'data-id'
		);
	};
}
setupConnector();
