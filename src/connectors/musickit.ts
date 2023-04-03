export {};

/*
 * Connector for Apple's MusicKit JS.
 */

let trackInfo = {};
let isPlaying = false;

Connector.isPlaying = () => isPlaying;

Connector.getTrackInfo = () => trackInfo;

Connector.onScriptEvent = (e) => {
	switch (e.data.type) {
		case 'MUSICKIT_STATE':
			trackInfo = e.data.trackInfo as any;
			isPlaying = e.data.isPlaying as boolean;

			Connector.onStateChanged();
			break;
		default:
			break;
	}
};

Connector.injectScript('connectors/musickit-dom-inject.js');
