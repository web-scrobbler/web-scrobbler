'use strict';

setupConnector();
function setupConnector() {
	['.player-info', '#now-playing'].forEach(function(playerSelector, index) {
		if ($(playerSelector).length) {
			Connector.playerSelector = playerSelector;
			if (index === 0) {
				setupArtistPlayer();
			} else {
				setupMapPlayer();
			}
		}
	});
}
function setupArtistPlayer() {
	Connector.artistTrackSelector = '.player-info-song-title-text';

	Connector.currentTimeSelector = 'span > .current';

	Connector.durationSelector = 'span > .total';

	Connector.isPlaying = () => {
		let text = $('.playback-play-icon').css('backgroundPosition');
		return text.includes('-40');
	};
}
function setupMapPlayer() {
	Connector.trackSelector = `${Connector.playerSelector} .card--artist__title`;

	Connector.artistSelector = `${Connector.playerSelector} .card--artist__subtitle a`;

	Connector.currentTimeSelector = '.progress-time';

	Connector.durationSelector = '.duration-seconds';

	Connector.isPlaying = () => 0 < $('.playing').length;
}
