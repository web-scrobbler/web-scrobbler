'use strict';

let trackInfo = {};
let isPlaying = false;

const vkFilter = new MetadataFilter({
	all: MetadataFilter.decodeHtmlEntities
});

Connector.isPlaying = () => isPlaying;

Connector.getTrackInfo = () => trackInfo;

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

	trackInfo = event.data.trackInfo;

	Connector.onStateChanged();
};

Connector.injectScript('connectors/vk-dom-inject.js');

Connector.applyFilter(vkFilter);
