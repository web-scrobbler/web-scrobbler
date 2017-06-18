'use strict';

/* global Connector, MetadataFilter, Util */

let currentState = {};

(function () {
	let scriptUrl = chrome.extension.getURL('connectors/vk-dom-inject.js');
	Util.injectScriptIntoDocument(scriptUrl);

	$(window).on('message', ({ originalEvent: event }) => {
		if (event.data.sender !== 'web-scrobbler') {
			return;
		}

		currentState = event.data.trackInfo;

		switch (event.data.type) {
			case 'start':
				currentState.isPlaying = true;
				break;
			case 'stop':
			case 'pause':
				currentState.isPlaying = false;
				break;
		}
		Connector.onStateChanged();
	});
})();

Connector.filter = new MetadataFilter({
	all: [MetadataFilter.decodeHtmlEntities, MetadataFilter.trim]
});

Connector.getCurrentState = () => currentState;
