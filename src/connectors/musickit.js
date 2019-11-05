'use strict';

/*
 * Connector for Apple's MusicKit JS.
 */

let trackInfo = {};
let isPlaying = false;

Connector.isPlaying = () => isPlaying;

Connector.getTrackInfo = () => trackInfo;

Connector.onScriptEvent = (e) => {
	switch (e.data.type) {
		case 'MUSICKIT_STATE':
			trackInfo = e.data.trackInfo;
			isPlaying = e.data.isPlaying;

			Connector.onStateChanged();
			break;
		default:
			break;
	}
};

Connector.injectScript('connectors/musickit-dom-inject.js');
