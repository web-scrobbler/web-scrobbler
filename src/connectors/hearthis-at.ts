export {};

const trackDetails: {
	artist: string | null;
	track: string | null;
	trackArt: string | null;
	currentTime: number | null;
} = {
	artist: null,
	track: null,
	trackArt: null,
	currentTime: null,
};

Connector.playerSelector = '.micro-player';

const defaultStateChange = Connector.onStateChanged;
Connector.onStateChanged = () => {
	window.postMessage({ sender: 'web-scrobbler', type: 'update' }, '*');
	defaultStateChange();
};
Connector.onScriptEvent = (e) => {
	if (e.data.type === 'info') {
		trackDetails.artist =
			typeof e.data.artist === 'string' ? e.data.artist : null;
		trackDetails.track =
			typeof e.data.title === 'string' ? e.data.title : null;
		trackDetails.trackArt =
			typeof e.data.img === 'string' ? e.data.img : null;

		if (typeof e.data.currentTime === 'number') {
			trackDetails.currentTime = e.data.currentTime;
		}
		defaultStateChange();
	}
};

Connector.injectScript('connectors/hearthis-at-dom-inject.js');
Connector.getTrack = () => trackDetails.track;
Connector.getArtist = () => trackDetails.artist;
Connector.getTrackArt = () => trackDetails.trackArt;
Connector.getCurrentTime = () => trackDetails.currentTime;
Connector.getDuration = () => {
	return (
		Number(
			document
				.querySelector('.micro-player > .playing > a')
				?.getAttribute('data-length') ?? 0,
		) / 1000 || null
	);
};
Connector.playButtonSelector = '.play_track';
