export {};

setupConnector();
function setupConnector() {
	['.player-info', '#now-playing'].forEach(function (playerSelector, index) {
		if (document.querySelector(playerSelector)) {
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
		const text = Util.getCSSPropertyFromSelectors(
			'.playback-play-icon',
			'background-position'
		);
		return Boolean(text?.includes('-40'));
	};
}
function setupMapPlayer() {
	Connector.trackSelector = `${Connector.playerSelector} .card--artist__title`;

	Connector.artistSelector = `${Connector.playerSelector} .card--artist__subtitle a`;

	Connector.currentTimeSelector = '.progress-time';

	Connector.durationSelector = '.duration-seconds';

	Connector.isPlaying = () => Boolean(document.querySelector('.playing'));
}
