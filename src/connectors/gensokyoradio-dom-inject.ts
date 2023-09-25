/**
 * This script runs in non-isolated environment (gensokyoradio.net itself)
 * for accessing the global `audio` player.
 *
 * Script is run as an IIFE to ensure variables are scoped, as in the event
 * of extension reload/update a new script will have to override the current one.
 *
 * Script starts by calling window.cleanup to cleanup any potential previous script.
 *
 * @returns a cleanup function that cleans up event listeners and similar for a future overriding script.
 */

// cleanup previous script
if ('cleanup' in window && typeof window.cleanup === 'function') {
	window.cleanup();
}

(window as unknown as { cleanup: () => void }).cleanup = (() => {
	interface Window {
		audio: HTMLAudioElement;
	}

	const listeners = ['play', 'pause', 'ended', 'emptied', 'suspend'];

	setupEventListener();

	function sendUpdateEvent() {
		window.postMessage(
			{
				sender: 'web-scrobbler',
				isPlaying: !(window as unknown as Window).audio.paused,
			},
			'*',
		);
	}

	function setupEventListener() {
		const audio = (window as unknown as Window).audio;

		for (const type of listeners) {
			audio.addEventListener(type, sendUpdateEvent);
		}
		sendUpdateEvent();
	}

	return () => {
		const audio = (window as unknown as Window).audio;
		if (!audio) {
			return;
		}
		for (const type of listeners) {
			audio.removeEventListener(type, sendUpdateEvent);
		}
	};
})();
