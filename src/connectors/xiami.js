'use strict';

const mainPlayerSelector = '.play-bar';
const playPlayerSelector = '#player-main';

const PLAYER_MAIN = 0x1;
const PLAYER_PLAY = 0x2;
const PLAYER_UNKNOWN = 0x3;

initConnectorProps();

function initConnectorProps() {
	switch (getPlayerType()) {
		case PLAYER_MAIN:
			Util.debugLog('Init connector for main player');
			initPropsForMainPlayer();
			break;
		case PLAYER_PLAY:
			Util.debugLog('Init connector for play player');
			initPropsForPlayPlayer();
			break;
		default:
			Util.debugLog('Unknown player', 'warn');
			break;
	}
}

function getPlayerType() {
	if (document.querySelector(mainPlayerSelector) !== null) {
		return PLAYER_MAIN;
	}

	if (document.querySelector(playPlayerSelector) !== null) {
		return PLAYER_PLAY;
	}

	return PLAYER_UNKNOWN;
}

function initPropsForMainPlayer() {
	const pauseSymbol = '\ue619';
	const trackSelector = '.music .info .title';

	Connector.playerSelector = mainPlayerSelector;

	Connector.trackSelector = '.music .info .title';

	Connector.artistSelector = '.music .info .singers';

	Connector.trackArtSelector = '.music .cover-link .active img';

	Connector.getUniqueID = () => {
		const trackUrl = Util.getAttrFromSelectors(trackSelector, 'href');
		return trackUrl && trackUrl.split('/song/')[1];
	};

	Connector.timeInfoSelector = '.audio-progress .range .bar .handle';

	Connector.isPlaying = () => {
		return Util.getTextFromSelectors('.main-control .play-btn') === pauseSymbol;
	};
}

function initPropsForPlayPlayer() {
	Connector.playerSelector = playPlayerSelector;

	Connector.getArtist = () => {
		const artistsNodes = document.querySelectorAll('#J_trackInfo a');
		return Util.joinArtists(Array.from(artistsNodes).slice(1));
	};

	Connector.trackSelector = '#J_trackName';

	Connector.playButtonSelector = '.play-btn';

	Connector.currentTimeSelector = '#J_positionTime';

	Connector.durationSelector = '#J_durationTime';

	Connector.trackArtSelector = '#J_playerCoverImg';

}
