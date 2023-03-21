export {};

const mainPlayerBar = '.controls';

if (isMainPlayer()) {
	Util.debugLog('Setup the connector for main player');

	setupMainPlayer();
} else {
	Util.debugLog('Setup the connector for Gold player');

	setupGoldPlayer();
}

function isMainPlayer() {
	return document.querySelector(mainPlayerBar) !== null;
}

function setupMainPlayer() {
	Connector.playerSelector = mainPlayerBar;

	Connector.artistTrackSelector = `${mainPlayerBar} .scroll-title`;

	Connector.pauseButtonSelector = `${mainPlayerBar} .fa-pause`;

	Connector.useMediaSessionApi();
}

function setupGoldPlayer() {
	Connector.playerSelector = '.control-bar';

	Connector.trackSelector = '.song-info .song-title';

	Connector.getArtist = () => {
		const artists = Util.queryElements('.song-info .artists-list a');

		if (artists !== null) {
			return Util.joinArtists([...artists]);
		}

		return null;
	};

	Connector.trackArtSelector = '.album-art';

	Connector.timeInfoSelector = '.active-song-time';

	Connector.pauseButtonSelector = '.play-pause .fa-pause';
}
