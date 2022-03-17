'use strict';

let trackInfo = {};
let isPlaying = false;

Connector.isPlaying = () => isPlaying;

Connector.getTrackInfo = () => trackInfo;

Connector.onScriptEvent = (event) => {
	switch (event.data.type) {
		case 'play':
			isPlaying = true;
			break;
		case 'pause':
			isPlaying = false;
			break;
	}

	trackInfo = event.data.trackInfo;

	Connector.onStateChanged();
};

Connector.injectScript('connectors/sber-zvuk-dom-inject.js');
