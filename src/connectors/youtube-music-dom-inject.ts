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

(window as unknown as { cleanup: () => void }).cleanup = (() => {
	const sendData = () => {
		window.postMessage(
			{
				sender: 'web-scrobbler',
				playbackState: navigator.mediaSession.playbackState,
				metadata: {
					title: navigator.mediaSession.metadata?.title,
					artist: navigator.mediaSession.metadata?.artist,
					artwork: navigator.mediaSession.metadata?.artwork,
					album: navigator.mediaSession.metadata?.album,
				},
			},
			'*',
		);
	};
	const playPauseButton = document.getElementById('play-pause-button');
	const SongInfo = document.querySelector('.content-info-wrapper');

	const observer = new MutationObserver(sendData);

	observer.observe(playPauseButton as Node, {
		attributes: true,
	});

	observer.observe(SongInfo as Node, {
		characterData: true,
		subtree: true,
	});

	return () => {
		// remove the subscribers added by this extension from the array.
		// we dont have a confirmed reference to it so we have to check all of them.
		observer.disconnect();
	};
})();
