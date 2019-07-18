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
	if ($(mainPlayerSelector).length > 0) {
		return PLAYER_MAIN;
	}

	if ($(playPlayerSelector).length > 0) {
		return PLAYER_PLAY;
	}

	return PLAYER_UNKNOWN;
}

function initPropsForMainPlayer() {
	const PAUSE_SYMBOL = '\ue619';

	Connector.playerSelector = mainPlayerSelector;

	Connector.trackSelector = '.music .info .title';

	Connector.artistSelector = '.music .info .singers';

	Connector.trackArtSelector = '.music .cover-link .active img';

	Connector.getUniqueID = () => $('.play-bar .content .title').attr('href').split('?')[0].split('/song/')[1];

	Connector.timeInfoSelector = '.audio-progress .range .bar .handle';

	Connector.isPlaying = () => {
		return $('.main-control .play-btn').text() === PAUSE_SYMBOL;
	};
}

function initPropsForPlayPlayer() {
	Connector.playerSelector = playPlayerSelector;

	Connector.getArtist = () => {
		const artists = $('#J_trackInfo a').toArray().slice(1);
		return Util.joinArtists(artists);
	};

	Connector.trackSelector = '#J_trackName';

	Connector.playButtonSelector = '.play-btn';

	Connector.currentTimeSelector = '#J_positionTime';

	Connector.durationSelector = '#J_durationTime';

	Connector.trackArtSelector = '#J_playerCoverImg';

}
