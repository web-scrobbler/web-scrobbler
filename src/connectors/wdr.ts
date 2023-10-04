export {};

// Connector for the WDR radio stations (1Live, WDR2, WDR3, WDR4, WDR5, COSMO, etc.)

Connector.playerSelector = '.wdrrCurrentChannels';

Connector.artistTrackSelector = '.wdrrCurrentShowTitleTitle';

Connector.isPlaying = () => {
	const playButton = document.querySelector('#playCtrl');
	return playButton !== null && playButton.classList.contains('playing');
};

// Don't scrobble if special strings like "WDR 5 Quarks - Wissenschaft und mehr mit Sebastian Sonntag"
