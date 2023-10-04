export {};

// Connector for the WDR radio stations (1Live, WDR2, WDR3, WDR4, WDR5, COSMO, etc.)

Connector.playerSelector = '.wdrrCurrentChannels';

Connector.artistTrackSelector = '.wdrrCurrentShowTitleTitle';

Connector.isPlaying = () => {
	const playButton = document.querySelector('#playCtrl');
	return playButton !== null && playButton.classList.contains('playing');
};

Connector.isScrobblingAllowed = () => {
	const artistTrack = Util.getTextFromSelectors(
		Connector.artistTrackSelector,
	);
	const disallowedStrings = [
		'1Live',
		'WDR 2',
		'WDR 3',
		'WDR 4',
		'WDR 5',
		'COSMO',
	];

	// Check if the artistTrack includes any of the disallowed strings
	const containsDisallowedString =
		artistTrack !== null &&
		disallowedStrings.some((disallowedString) =>
			artistTrack.includes(disallowedString),
		);

	// Scrobble only if none of the disallowed strings are included
	return !containsDisallowedString;
};
