'use strict';

let state = {};

Connector.getArtist = () => state.artist;
Connector.getTrack = () => state.title;
Connector.getAlbum = () => state.album;
Connector.getDuration = () => state.duration;
Connector.getCurrentTime = () => state.currentTime;
Connector.getRemainingTime = () => state.duration - state.currentTime;
Connector.getUniqueID = () => state.uniqueId;
Connector.isPlaying = () => state.isPlaying;
Connector.getTrackArt = () => state.trackArt;

Connector.filter = MetadataFilter.getRemasteredFilter().extend(MetadataFilter.getDoubleTitleFilter());

Connector.onScriptEvent = (e) => {
	switch (e.data.type) {
	case 'DEEZER_STATE':
		state = e.data.state;
		Connector.onStateChanged();
		break;
	default:
		break;
	}
}

Connector.injectScript('connectors/deezer-dom-inject.js');
