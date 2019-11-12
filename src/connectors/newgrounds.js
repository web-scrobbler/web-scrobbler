'use strict';

const globalArtistSelector = '.ng-apg-media-artist';
const globalTrackSelector = '.ng-apg-media-title';
const embeddedTrackSelector = "name";
const embeddedArtistSelector = '.smaller';

function setupConnector() {
	var artistSelector, trackSelector;

	if (isEmbeddedPlayer()) {
		artistSelector = embeddedArtistSelector;

		trackSelector = embeddedTrackSelector;

		setupEmbeddedPlayer();
	} else {
		artistSelector = globalArtistSelector;

		trackSelector = globalTrackSelector;

		setupGlobalPlayer();
	}

	Connector.getArtistTrack = () => {
		let {artist, track} = Util.splitArtistTrack(Util.getTextFromSelectors(trackSelector), '-');

		if (!artist) {
			artist = Util.getTextFromSelectors(artistSelector);
			track = Util.getTextFromSelectors(trackSelector);
		}

		return { artist, track };
	};
}

function isEmbeddedPlayer() {
	return $('audio-listen-player').length > 0;
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

setupConnector()
