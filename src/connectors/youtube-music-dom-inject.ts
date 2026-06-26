export {};

/**
 * This script runs in non-isolated environment(youtube music itself)
 * for accessing navigator variables on Firefox
 *
 * * Script is run as an IIFE to ensure variables are scoped, as in the event
 * of extension reload/update a new script will have to override the current one.
 *
 * Script starts by calling window.cleanup to cleanup any potential previous script.
 *
 * @returns a cleanup function that cleans up event listeners and similar for a future overriding script.
 */

if ('cleanup' in window && typeof window.cleanup === 'function') {
	(window as unknown as { cleanup: () => void }).cleanup();
}

type MessagePayload = {
	sender: 'web-scrobbler';
	playbackState: MediaSessionPlaybackState;
	metadata: {
		title?: string;
		artist?: string;
		artwork?: readonly MediaImage[];
		album?: string;
	};
};

(window as unknown as { cleanup: () => void }).cleanup = (() => {
	let previousPayload: MessagePayload | null = null;

	let pollInterval: number | null = window.setInterval(() => {
		const payload: MessagePayload = {
			sender: 'web-scrobbler',
			playbackState: navigator.mediaSession.playbackState,
			metadata: {
				title: navigator.mediaSession.metadata?.title,
				artist: navigator.mediaSession.metadata?.artist,
				artwork: navigator.mediaSession.metadata?.artwork,
				album: navigator.mediaSession.metadata?.album,
			},
		};

		if (
			!previousPayload ||
			payload.playbackState !== previousPayload.playbackState ||
			payload.metadata.title !== previousPayload.metadata.title ||
			payload.metadata.artist !== previousPayload.metadata.artist ||
			payload.metadata.artwork !== previousPayload.metadata.artwork ||
			payload.metadata.album !== previousPayload.metadata.album
		) {
			window.postMessage(payload, '*');

			previousPayload = payload;
		}
	}, 1000);

	return () => {
		if (pollInterval !== null) {
			window.clearInterval(pollInterval);
			pollInterval = null;
		}
	};
})();
