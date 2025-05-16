export {};

setupConnector();

function setupConnector() {
	if (isOldPlayer()) {
		setupOldConnector();
	} else {
		setupNewConnector();
	}
}

function isOldPlayer() {
	return (
		(window as unknown as { externalAPI: unknown }).externalAPI !==
		undefined
	);
}

function setupNewConnector() {
	// Player
	Connector.playerSelector = 'section[class*=PlayerBar_root__]';

	Connector.pauseButtonSelector = [
		'button[aria-label=Pause]',
		'button[aria-label=Пауза]',
		'button[aria-label=Pauza]',
		'button[aria-label=Үзіліс]',
	];

	// Track info
	Connector.trackSelector = `${Connector.playerSelector} span[class*=Meta_title__]`;

	Connector.artistSelector = `${Connector.playerSelector} span[class*=Meta_artistCaption__]`;

	Connector.trackArtSelector = [
		'section img[class*=PlayerBarDesktop_cover__]',
		'section img[class*=PlayerBarMobile_cover__]',
	];

	// Duration
	Connector.currentTimeSelector =
		'section span[class*=Timecode_root_start__]';
	Connector.durationSelector = 'section span[class*=Timecode_root_end__]';

	// Likes
	Connector.loveButtonSelector = [
		'div[class*=PlayerBarDesktop_infoButtons__] button',
		'div[class*=PlayerBarMobile_infoButtons__] button',
	];

	Connector.isLoved = () => {
		const loved = Util.getAttrFromSelectors(
			Connector.loveButtonSelector,
			'aria-pressed',
		);

		if (loved === null) {
			return null;
		}

		return loved === 'true';
	};
}

function setupOldConnector() {
	let trackInfo = {};
	let isPlaying = false;

	Connector.isPlaying = () => isPlaying;

	Connector.getTrackInfo = () => trackInfo;

	Connector.onScriptEvent = (e) => {
		switch (e.data.type) {
			case 'YANDEX_MUSIC_STATE':
				trackInfo = e.data.trackInfo as object;
				isPlaying = e.data.isPlaying as boolean;

				Connector.onStateChanged();
				break;
			default:
				break;
		}
	};

	Connector.injectScript('connectors/yandex-music-dom-inject.js');
}
