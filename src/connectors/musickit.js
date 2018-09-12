'use strict';

/** Connector for Apple's MusicKit JS. */
let state = {};

Connector.getArtist = () => state.artistName;
Connector.getTrack = () => state.title;
Connector.getAlbum = () => state.albumName;
Connector.getDuration = () => state.duration;
Connector.getCurrentTime = () => state.currentTime;
Connector.getRemainingTime =
		() => Connector.getDuration() - Connector.getCurrentTime();
Connector.getUniqueID = () => state.id;
Connector.isPlaying = () => state.isPlaying;
Connector.getTrackArt = () => state.artworkURL;

Connector.onScriptEvent = (e) => {
	switch (e.data.type) {
		case 'MUSICKIT_STATE':
			state = e.data.state;
			Connector.onStateChanged();
			break;
		default:
			break;
	}
};

Connector.injectScript('connectors/musickit-dom-inject.js');
