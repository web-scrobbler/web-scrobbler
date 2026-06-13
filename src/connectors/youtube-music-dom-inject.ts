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
	type Indexable = Record<string | symbol, unknown>;

	const handler: ProxyHandler<MediaSession> = {
		get: (target: MediaSession, prop: string | symbol): unknown => {
			return (target as unknown as Indexable)[prop];
		},
		set: (
			target: MediaSession,
			prop: string | symbol,
			value: unknown,
		): boolean => {
			(target as unknown as Indexable)[prop] = value;
			sendData();
			return true;
		},
	};

	const proxy = new Proxy(navigator.mediaSession, handler);

	Object.defineProperty(navigator, 'mediaSession', {
		get() {
			return proxy;
		},
		configurable: true,
	});

	function sendData(): void {
		const metadata = proxy.metadata;

		window.postMessage(
			{
				sender: 'web-scrobbler',
				playbackState: proxy.playbackState,
				metadata: metadata
					? {
							title: metadata.title,
							artist: metadata.artist,
							artwork: metadata.artwork,
							album: metadata.album,
						}
					: null,
			},
			'*',
		);
	}

	navigator.mediaSession.metadata = new MediaMetadata();

	return () => {
		// Remove listener: restore handler.set without `any`
		handler.set = (
			target: MediaSession,
			prop: string | symbol,
			value: unknown,
		): boolean => {
			(target as unknown as Indexable)[prop] = value;
			return true;
		};
	};
})();
