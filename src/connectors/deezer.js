'use strict';

const deezerFilter = MetadataFilter.getRemasteredFilter().extend(
	MetadataFilter.getDoubleTitleFilter());

let state = {};

Connector.isPlaying = () => state.isPlaying;

Connector.getCurrentState = () => state;

Connector.applyFilter(deezerFilter);

Connector.onScriptEvent = (e) => {
	switch (e.data.type) {
		case 'DEEZER_STATE':
			state = e.data.state;
			Connector.onStateChanged();
			break;
		default:
			break;
	}
};

Connector.injectScript('connectors/deezer-dom-inject.js');
