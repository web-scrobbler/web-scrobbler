'use strict';

/*
 * Connector for Apple's MusicKit JS.
 */

let currentState = {};

Connector.isPlaying = () => currentState.isPlaying;

Connector.getCurrentState = () => currentState;

Connector.onScriptEvent = (e) => {
	switch (e.data.type) {
		case 'MUSICKIT_STATE':
			currentState = e.data.state;
			Connector.onStateChanged();
			break;
		default:
			break;
	}
};

Connector.injectScript('connectors/musickit-dom-inject.js');
