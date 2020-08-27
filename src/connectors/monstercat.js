'use strict';

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
	Connector.playerSelector = '#controlbar';

	Connector.trackSelector = '.song-info .song-title';

	Connector.getArtist = () => {
		const artists = Util.queryElements('.song-info .artist-name');

		if (artists !== null) {
			return Util.joinArtists(artists.toArray());
		}

		return null;
	};

	Connector.trackArtSelector = '.album-art';

	Connector.timeInfoSelector = '.active-song-time';

	Connector.pauseButtonSelector = '.play-pause-btn .fa-pause';
}
