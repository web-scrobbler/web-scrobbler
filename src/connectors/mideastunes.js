'use strict';

const artistPlayerBar = '.player-info';
const mapPlayerBar = '#now-playing';

setupConnector();

function setupConnector() {
	if (isArtistPlayer()) {
		setupArtistPlayer();
	} else if (isMapPlayer()) {
		setupMapPlayer();
	} else {
		Util.debugLog('Unknown player');
	}
}

function isArtistPlayer() {
	return document.querySelector(artistPlayerBar) !== null;
}

function isMapPlayer() {
	return document.querySelector(mapPlayerBar) !== null;
}

function setupArtistPlayer() {
	Connector.playerSelector = artistPlayerBar;

	Connector.artistTrackSelector = '.player-info-song-title-text';

	Connector.currentTimeSelector = 'span > .current';

	Connector.durationSelector = 'span > .total';

	Connector.pauseButtonSelector = '.playback-play.paused';
}

function setupMapPlayer() {
	Connector.playerSelector = mapPlayerBar;

	Connector.trackSelector = `${Connector.playerSelector} .card--artist__title`;

	Connector.artistSelector = `${Connector.playerSelector} .card--artist__subtitle a`;

	Connector.currentTimeSelector = '.progress-time';

	Connector.durationSelector = '.duration-seconds';

	Connector.pauseButtonSelector = '.play-button.playing';
}
