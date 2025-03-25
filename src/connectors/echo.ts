import type { TrackInfoWithAlbum } from '@/core/types';

export {};

let trackInfo: TrackInfoWithAlbum | undefined;

const queryPlayerElement = () =>
	document
		.querySelector('app-root')
		?.shadowRoot?.querySelector('app-header')
		?.shadowRoot?.querySelector('echo-player');

Connector.getTrackInfo = () => trackInfo;
Connector.isPlaying = () => !!trackInfo;

type EchoTrackInfo = {
	trackName: string;
	artistName: string;
	albumName: string;
	providerId: string;
};

const startObserving = (player: Element) => {
	player.addEventListener('track-playing', (event) => {
		const customEvent = event as CustomEvent<EchoTrackInfo>;

		const providerId = customEvent.detail.providerId;
		if (providerId === 'spotify') {
			// Skip Spotify tracks since those are already handled by the Last.fm
			// built-in scrobbling support. Remove previous to avoid keeping
			// it playing forever.
			trackInfo = undefined;
		} else {
			trackInfo = {
				track: customEvent.detail.trackName,
				artist: customEvent.detail.artistName,
				album: customEvent.detail.albumName,
			};
		}

		Connector.onStateChanged();
	});

	player.addEventListener('track-paused', () => {
		trackInfo = undefined;
		Connector.onStateChanged();
	});
};

// Wait until the player is loaded and start observing.
const timer = setInterval(() => {
	const player = queryPlayerElement();

	if (player) {
		startObserving(player);
		clearInterval(timer);
	}
}, 2000);
