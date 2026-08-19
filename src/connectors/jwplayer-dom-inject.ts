export {};

/**
 * This script runs in non-isolated environment (eg. internet archive itself)
 * for accessing the jwplayer variables.
 *
 * https://docs.jwplayer.com/players/docs/jw8-reference
 *
 * * Script is run as an IIFE to ensure variables are scoped, as in the event
 * of extension reload/update a new script will have to override the current one.
 *
 * Script starts by calling window.cleanup to cleanup any potential previous script.
 *
 * @returns a cleanup function that cleans up event listeners and similar for a future overriding script.
 *
 * @see {@link ./archive.ts} for an example for using this
 */

declare global {
	interface Window {
		jwplayer?: () => JwplayerApi;
		cleanup?: () => void;
	}
}

export type State = {
	isPlaying: boolean;
	getDuration: number;
	getTrack: string;
	getArtist: string;
	getPlaylist: Array<string>;
};

interface JwplayerApi {
	getState: () => string;
	getDuration: () => number;
	getPlaylistItem: () => JwplayerPlaylistItem;
	getPlaylist: () => Array<JwplayerPlaylistItem>;
	on: (_: string, __: () => void) => void;
	off: (_: string, __: () => void) => void;
}

type JwplayerPlaylistItem = {
	title: string;
	artist: string;
};

if (typeof window.cleanup === 'function') {
	window.cleanup();
}

window.cleanup = (() => {
	let player: JwplayerApi;

	const sendData = () => {
		window.postMessage(
			{
				sender: 'web-scrobbler',
				state: <State>{
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

	// Wait until the player is loaded
	let timer: ReturnType<typeof setInterval>;
	let init = () => {
		if (!window.jwplayer) {
			return;
		}
		player = window.jwplayer();

		if (player.on) {
			player.on('play', sendData);
			player.on('pause', sendData);
			clearInterval(timer);
		}
	};
	timer = setInterval(init, 2000);
	init();

	return () => {
		clearInterval(timer);
		player.off('play', sendData);
		player.off('pause', sendData);
	};
})();
