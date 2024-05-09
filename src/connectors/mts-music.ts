export {};

// Selects previous node to .Toastify
Connector.playerSelector = 'div:has(+ .Toastify)';
Connector.artistSelector =
	'[data-testid=player-song-info] [data-testid=player-song-author]';
Connector.trackSelector = '[data-testid=player-song-info] [itemprop=name]';
Connector.trackArtSelector = '[data-testid=player-song-icon] img';
Connector.currentTimeSelector = '[data-testid=player-current-time]';
Connector.durationSelector = '[data-testid=player-full-time]';

const playButtonSelector = '[data-testid=player-play]';

Connector.isPlaying = () => {
	const playButton = document.querySelector(playButtonSelector);
	if (playButton === null) {
		return false;
	}

	const imageCSS = window.getComputedStyle(playButton).backgroundImage;
	return imageCSS.includes('pause');
};
