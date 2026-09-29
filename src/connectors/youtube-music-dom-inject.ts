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

	const observer = new MutationObserver(sendData);

	// Selectors for play/pause button (new UI first, then legacy)
	const playPauseSelectors = [
		'ytmusic-miniplayer #play-pause-button',
		'ytmusic-player-bar #play-pause-button',
		'#play-pause-button',
	];

	// Selectors for song info (new UI first, then legacy)
	const songInfoSelectors = [
		'ytmusic-miniplayer ytmusic-track-info',
		'ytmusic-player-bar .content-info-wrapper',
		'.content-info-wrapper',
	];

	const findElement = (selectors: string[]): Element | null => {
		for (const selector of selectors) {
			const el = document.querySelector(selector);
			if (el) {
				return el;
			}
		}
		return null;
	};

	const setupObservers = () => {
		const playPauseButton = findElement(playPauseSelectors);
		const songInfo = findElement(songInfoSelectors);

		if (playPauseButton) {
			observer.observe(playPauseButton, { attributes: true });
		}

		if (songInfo) {
			observer.observe(songInfo, { attributes: true, subtree: true });
		}

		return playPauseButton && songInfo;
	};

	// Try to set up observers immediately
	if (!setupObservers()) {
		// If elements not found, wait for them (new UI may render late)
		const retryObserver = new MutationObserver(() => {
			if (setupObservers()) {
				retryObserver.disconnect();
				sendData();
			}
		});
		retryObserver.observe(document.body, {
			childList: true,
			subtree: true,
		});
	} else {
		sendData();
	}

	// Send data periodically to catch state changes that don't trigger mutations
	setInterval(sendData, 1000);

	return () => {
		observer.disconnect();
	};
})();
