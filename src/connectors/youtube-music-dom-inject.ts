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

/**
 * Throttle fn to at most one run per interval, leading-plus-trailing:
 * a burst gets an immediate run when the window has elapsed, otherwise
 * a single trailing run. A pending trailing run cannot be cancelled.
 */
function throttle(fn: () => void, interval: number): () => void {
	let lastRun = 0;
	let timer: ReturnType<typeof setTimeout> | null = null;

	// Also the trailing callback: clearing the stale handle reopens
	// scheduling for the next burst.
	function execute() {
		lastRun = Date.now();

		if (timer !== null) {
			clearTimeout(timer);
			timer = null;
		}

		fn();
	}

	return function runThrottle() {
		const remaining = interval - (Date.now() - lastRun);

		// Trailing edge: the window is still open, so schedule this
		// burst's closing run and wait for it.
		if (remaining > 0) {
			if (timer === null) {
				timer = setTimeout(execute, remaining);
			}
			return;
		}

		// Leading edge: the window has elapsed, so run now.
		execute();
	};
}

/**
 * Run attempt() immediately and on body mutations until it returns
 * true. Returns a function that stops the retries.
 */
function retryUntil(attempt: () => boolean, interval: number) {
	const runThrottle = throttle(function tryOnce() {
		if (attempt()) {
			retryObserver.disconnect();
		}
	}, interval);

	const retryObserver = new MutationObserver(runThrottle);

	retryObserver.observe(document.body, {
		childList: true,
		subtree: true,
	});
	runThrottle();

	return retryObserver.disconnect.bind(retryObserver);
}

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

	// Selectors cover both the legacy and redesigned player; return
	// true once both elements are found.
	const tryAttach = () => {
		const playPauseButton = document.getElementById('play-pause-button');
		const songInfo = document.querySelector(
			'.content-info-wrapper, ytmusic-track-info',
		);

		if (playPauseButton !== null) {
			observer.observe(playPauseButton, {
				attributes: true,
			});
		}

		if (songInfo !== null) {
			observer.observe(songInfo, {
				attributes: true,
				subtree: true,
			});
		}

		if (playPauseButton === null || songInfo === null) {
			return false;
		}

		sendData();
		return true;
	};

	// The redesigned player can render after page load.
	const stopRetrying = retryUntil(tryAttach, 2000);

	return () => {
		// remove the subscribers added by this extension from the array.
		// we dont have a confirmed reference to it so we have to check all of them.
		observer.disconnect();
		stopRetrying();
	};
})();
