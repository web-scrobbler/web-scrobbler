'use strict';

let trackInfo = {};
let isPlaying = false;

Connector.isPlaying = () => isPlaying;

Connector.getTrackInfo = () => trackInfo;

Connector.onScriptEvent = (e) => {
	switch (e.data.type) {
		case 'YANDEX_MUSIC_STATE':
			trackInfo = e.data.trackInfo;
			isPlaying = e.data.isPlaying;

			Connector.onStateChanged();
			break;
		default:
			break;
	}
};

Connector.injectScript('connectors/yandex-music-dom-inject.js');
