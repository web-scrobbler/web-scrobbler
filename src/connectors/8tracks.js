'use strict';

function setupConnector() {
	setupCommonProperties();
	if (isYoutubePlayer()) {
		setupYoutubePlayer();
	} else {
		setup8tracksPlayer();
	}
}

function isYoutubePlayer() {
	return $('body').hasClass('international');
}

function setupYoutubePlayer() {
	Connector.playerSelector = '#main';

	Connector.isPlaying = () => $('#mix_youtube').hasClass('playing');

	Connector.getUniqueID = () => {
		return $('.track_details_container a').data('track_id');
	};
}

function setup8tracksPlayer() {
	Connector.playerSelector = '#player';

	Connector.playButtonSelector = '#player_play_button';
}

function setupCommonProperties() {
	Connector.artistSelector = '#now_playing .title_artist .a';

	Connector.trackSelector = '#now_playing .title_artist .t';

	Connector.albumSelector = '#now_playing .album .detail';

	Connector.trackArtSelector = '#player_mix img';

	Connector.getUniqueID = () => {
		let trackId = $('.track_details').attr('id');
		if (trackId) {
			return trackId.replace('track_details_', '');
		}

		return null;
	};
}

setupConnector();
