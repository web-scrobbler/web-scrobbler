export {};

/**
 * This script runs in non-isolated environment(internet archive itself)
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
				state: {
					isPlaying: jwplayer().getState() === 'playing',
					getDuration: jwplayer().getDuration(),
					getTrack: jwplayer().getPlaylistItem().title,
					getArtist: jwplayer().getPlaylistItem().artist,
					getPlaylist: jwplayer().getPlaylist(),
				},
			},
			'*',
		);
	};
	jwplayer().on('play', sendData);
	jwplayer().on('pause', sendData);

	return () => {
		jwplayer().off('play', sendData);
		jwplayer().off('pause', sendData);
	};
})();
