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

interface Window {
	jwplayer: () => JwplayerApi;
}

interface JwplayerApi {
	getState: () => string;
	getDuration: () => number;
	getPlaylistItem: () => JwplayerPlaylistItem;
	getPlaylist: () => Array<JwplayerPlaylistItem>;
	on: (_: string, __: Function) => void;
	off: (_: string, __: Function) => void;
}

type JwplayerPlaylistItem = {
	title: string;
	artist: string;
};

if ('cleanup' in window && typeof window.cleanup === 'function') {
	(window as unknown as { cleanup: () => void }).cleanup();
}

(window as unknown as { cleanup: () => void }).cleanup = (() => {
	const player = (window as unknown as Window).jwplayer();

	const sendData = () => {
		window.postMessage(
			{
				sender: 'web-scrobbler',
				state: {
					isPlaying: player.getState() === 'playing',
					getDuration: player.getDuration(),
					getTrack: player.getPlaylistItem().title,
					getArtist: player.getPlaylistItem().artist,
					// .map() is needed for videos with subtitles
					// DOMException: VTTCue object could not be cloned.
					getPlaylist: player
						.getPlaylist()
						.map((playlistItem) => playlistItem.title),
				},
			},
			'*',
		);
	};
	player.on('play', sendData);
	player.on('pause', sendData);

	return () => {
		player.off('play', sendData);
		player.off('pause', sendData);
	};
})();
