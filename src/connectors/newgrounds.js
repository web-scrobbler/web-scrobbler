'use strict';

const artistSelector = '.ng-apg-media-artist';
const trackSelector = '.ng-apg-media-title';

function setupConnector() {
	if (isEmbeddedPlayer()) {
		setupEmbeddedPlayer();

		Connector.getArtistTrack = () => {
			let { artist, track } = Util.splitArtistTrack(document.getElementsByTagName('h2')[0].innerText, '-');

			if (!artist) {
				artist = document.getElementsByTagName('h4')[0].innerText;
				track = document.getElementsByTagName('h2')[0].innerText;
			}

			return { artist, track };
		};
	} else {
		setupGlobalPlayer();

		Connector.getArtistTrack = () => {
			let { artist, track } = Util.splitArtistTrack(Util.getTextFromSelectors(trackSelector), '-');

			if (!artist) {
				artist = Util.getTextFromSelectors(artistSelector);
				track = Util.getTextFromSelectors(trackSelector);
			}

			return { artist, track };
		};
	}
}

function isEmbeddedPlayer() {
	return $('#audio-listen-player').length > 0;
}

function setupGlobalPlayer() {
	Connector.playerSelector = '#_ngHiddenAudioPlayer';

	Connector.playButtonSelector = '#global-audio-player-play';

	Connector.pauseButtonSelector = '#global-audio-player-pause';

	Connector.trackArtSelector = '.ng-apg-media-icon';

	Connector.currentTimeSelector = '#global-audio-player-progress';

	Connector.durationSelector = '#global-audio-player-duration';
}

function setupEmbeddedPlayer() {
	Connector.playerSelector = '#audio-listen-player';

	Connector.playButtonSelector = '#audio-listen-play';

	Connector.pauseButtonSelector = '#audio-listen-pause';

	Connector.currentTimeSelector = '#audio-listen-progress';

	Connector.durationSelector = '#audio-listen-duration';
}

setupConnector();
