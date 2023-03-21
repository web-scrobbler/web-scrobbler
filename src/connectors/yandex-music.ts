export {};

let trackInfo = {};
let isPlaying = false;

Connector.isPlaying = () => isPlaying;

Connector.getTrackInfo = () => trackInfo;

Connector.onScriptEvent = (e) => {
	switch (e.data.type) {
		case 'YANDEX_MUSIC_STATE':
			trackInfo = e.data.trackInfo as any;
			isPlaying = e.data.isPlaying as boolean;

			Connector.onStateChanged();
			break;
		default:
			break;
	}
};

Connector.injectScript('connectors/yandex-music-dom-inject.js');
