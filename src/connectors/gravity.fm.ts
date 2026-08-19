export {};

Connector.artistSelector = '.control-bar .track-info-stack .username-link';
Connector.trackSelector = '.control-bar .track-info-stack .track-title-link';
Connector.currentTimeSelector = '#time';
Connector.durationSelector = '#duration';
Connector.trackArtSelector = '.control-bar img.small-track-avatar';
Connector.playerSelector = ['.player-content'];

Connector.isPlaying = () => {
	const playPauseButtonSelector =
		'.player-content .control-bar .play-pause-btn > svg';

	return (
		document
			.querySelector(playPauseButtonSelector)
			?.getAttribute('data-icon') === 'pause'
	);
};

Connector.isLoved = () => {
	const saveButtonSelector = '.player-content .control-bar button.save-btn';

	return document
		.querySelector<HTMLButtonElement>(saveButtonSelector)
		?.innerText.includes('SAVED');
};
