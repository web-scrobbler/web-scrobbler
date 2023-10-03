export {};

function setupConnector() {
	setupCommonProperties();
	if (isYoutubePlayer()) {
		setupYoutubePlayer();
	} else {
		setup8tracksPlayer();
	}
}

function isYoutubePlayer() {
	return Util.hasElementClass('body', 'international');
}

function setupYoutubePlayer() {
	Connector.playerSelector = '#youtube_player';

	Connector.isPlaying = () => Util.hasElementClass('#mix_youtube', 'playing');

	Connector.getUniqueID = () => {
		return Util.getDataFromSelectors(
			'.track_details_container a',
			'track_id',
		);
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
		const trackId = Util.getAttrFromSelectors('.track_details', 'id');
		if (trackId) {
			return trackId.replace('track_details_', '');
		}

		return null;
	};
}

setupConnector();
