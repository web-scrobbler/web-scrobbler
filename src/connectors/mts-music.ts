export {};

Connector.playerSelector = [
	'div:has(+ .Toastify)', // Desktop player
	'#mini-player', // Mini player
];

Connector.artistSelector = [
	'[data-testid=player-song-author]', // Desktop
	'#mini-player div:not(:has(+p)) > p', // Mini
];

// The default implementation puts children nodes' content on new lines
Connector.getArtist = () => {
	const node =
		document.querySelector(Connector.artistSelector![0]) ||
		document.querySelector(Connector.artistSelector![1]);

	return node?.textContent;
};

Connector.trackSelector = [
	'[data-testid=player-song-info] > div:first-child p', // Desktop
	'#mini-player div:has(+p) > p', // Mini
];

Connector.trackArtSelector = [
	'[data-testid=player-song-icon] img', // Desktop
	'#mini-player img', // Mini
];

Connector.currentTimeSelector = [
	'[data-testid=player-current-time]', // Desktop
];

Connector.durationSelector = [
	'[data-testid=player-full-time]', // Desktop
];

Connector.isPlaying = () => {
	const playButton = document.querySelector('[data-testid=player-play]');
	let paths;

	if (playButton) {
		paths = playButton.querySelectorAll('svg path');
	} else {
		paths = document.querySelectorAll(
			'#mini-player button:not(#tooltipTrack) svg path',
		);
	}

	// pause svg consists of 2 paths
	return paths.length === 2;
};
