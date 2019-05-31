'use strict';

let currentState = {};
let isPlaying = false;

const vkFilter = new MetadataFilter({
	all: MetadataFilter.decodeHtmlEntities
});

Connector.isPlaying = () => isPlaying;

Connector.getCurrentState = () => currentState;

Connector.onScriptEvent = (event) => {
	switch (event.data.type) {
		case 'start':
			isPlaying = true;
			break;
		case 'stop':
		case 'pause':
			isPlaying = false;
			break;
	}

	currentState = event.data.trackInfo;
	currentState.isPlaying = isPlaying;

	Connector.onStateChanged();
};

Connector.injectScript('connectors/vk-dom-inject.js');

Connector.applyFilter(vkFilter);
