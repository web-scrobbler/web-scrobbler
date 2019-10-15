'use strict';

let state = {};

Connector.isPlaying = () => state.isPlaying;

Connector.getCurrentState = () => state;

Connector.onScriptEvent = (e) => {
	switch (e.data.type) {
		case 'YANDEX_MUSIC_STATE':
			state = e.data.state;
			Connector.onStateChanged();
			break;
		default:
			break;
	}
};

Connector.injectScript('connectors/yandex-music-dom-inject.js');
