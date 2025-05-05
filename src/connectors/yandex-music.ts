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
	Connector.playerSelector = [
		'section[class*=PlayerBarDesktop_root__]',
		'section[class*=PlayerBarMobile_root__]',
	];

	Connector.pauseButtonSelector = [
		'button[aria-label=Pause]',
		'button[aria-label=Пауза]',
		'button[aria-label=Pauza]',
		'button[aria-label=Үзіліс]',
	];

	Connector.trackSelector = 'section span[class*=Meta_title__]';

	Connector.artistSelector = 'section span[class*=Meta_artistCaption__]';

	Connector.trackArtSelector = [
		'section img[class*=PlayerBarDesktop_cover__]',
		'section img[class*=PlayerBarMobile_cover__]',
	];
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
