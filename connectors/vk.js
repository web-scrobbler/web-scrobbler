'use strict';

let currentState = {};
let isPlaying = false;

setupMessageListener();

Connector.filter = new MetadataFilter({
	all: [MetadataFilter.decodeHtmlEntities, MetadataFilter.trim]
});

Connector.getCurrentState = () => currentState;

function setupMessageListener() {
	// FIXME: Replace to `chrome.runtime.getURL`.
	let scriptUrl = chrome.extension.getURL('connectors/vk-dom-inject.js');
	Util.injectScriptIntoDocument(scriptUrl);

	window.addEventListener('message', onMessage.bind(Connector));
}

function onMessage(event) {
	if (event.data.sender !== 'web-scrobbler') {
		return;
	}

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

	this.onStateChanged();
	console.log(Connector);
}
