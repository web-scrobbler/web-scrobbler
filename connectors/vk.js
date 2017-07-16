'use strict';

let currentState = {};
let isPlaying = false;

(function () {
	let scriptUrl = chrome.extension.getURL('connectors/vk-dom-inject.js');
	Util.injectScriptIntoDocument(scriptUrl);

	$(window).on('message', ({ originalEvent: event }) => {
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

		Connector.onStateChanged();
	});
})();

Connector.filter = new MetadataFilter({
	all: [MetadataFilter.decodeHtmlEntities, MetadataFilter.trim]
});

Connector.getCurrentState = () => currentState;
