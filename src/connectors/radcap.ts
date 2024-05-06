export {};

function setupConnector() {
	if (isDesktopPlayer()) {
		setupDesktopPlayer();
	} else {
		setupMobilePlayer();
	}
}

function isDesktopPlayer() {
	return Boolean(document.querySelector('.radio'));
}

function setupDesktopPlayer() {
	Connector.playerSelector = '.radio';

	Connector.artistTrackSelector = '.stream.stream-signal > tbody > tr > td';

	const playButtonSelector =
		'#oframeplayer-d > pjsdiv:nth-child(7) > pjsdiv:nth-child(2) > pjsdiv:nth-child(1)';

	Connector.isPlaying = () => {
		return (
			Util.getCSSPropertyFromSelectors(
				playButtonSelector,
				'visibility',
			) === 'hidden'
		);
	};
}

function setupMobilePlayer() {
	Connector.playerSelector = '.container';

	Connector.artistTrackSelector = 'table.stream > tbody > tr > td';

	const upperPlayerPlayButton =
		'#oframeaudioplayer2 > pjsdiv:nth-child(8) > pjsdiv:nth-child(2) > pjsdiv:nth-child(1)';

	const lowerPlayerPlayButton =
		'#oframeaudioplayer0 > pjsdiv:nth-child(8) > pjsdiv:nth-child(2) > pjsdiv:nth-child(1)';

	Connector.isPlaying = () => {
		return (
			Util.getCSSPropertyFromSelectors(
				upperPlayerPlayButton,
				'visibility',
			) === 'hidden' ||
			Util.getCSSPropertyFromSelectors(
				lowerPlayerPlayButton,
				'visibility',
			) === 'hidden'
		);
	};
}

setupConnector();
