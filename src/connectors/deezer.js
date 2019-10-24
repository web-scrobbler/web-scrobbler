'use strict';

const deezerFilter = MetadataFilter.getRemasteredFilter().extend(
	MetadataFilter.getDoubleTitleFilter());

let trackInfo = {};
let isPlaying = false;

Connector.isPlaying = () => isPlaying;

Connector.getTrackInfo = () => trackInfo;

Connector.applyFilter(deezerFilter);

Connector.onScriptEvent = (e) => {
	switch (e.data.type) {
		case 'DEEZER_STATE':
			trackInfo = e.data.trackInfo;
			isPlaying = e.data.isPlaying;

			Connector.onStateChanged();
			break;
		default:
			break;
	}
};

Connector.injectScript('connectors/deezer-dom-inject.js');
