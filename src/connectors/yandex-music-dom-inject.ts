/**
 * This script runs in non-isolated environment(yandex music itself)
 * for accessing window variables
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
		externalAPI: {
			on: (_: unknown, __: () => void) => void;
			off: (_: unknown, __: () => void) => void;
			EVENT_STATE: unknown;
			EVENT_TRACK: unknown;
			isPlaying: () => boolean;
			getCurrentTrack: () => {
				title: string;
				album: { title: string };
				cover: string;
				artists: { title: string }[];
				duration: number;
				link: string;
			};
			getProgress: () => { position: number };
		};
	}

	const API = (window as unknown as Window).externalAPI;

	setupListeners();

	function setupListeners() {
		API.on(API.EVENT_STATE, onEvent);
		API.on(API.EVENT_TRACK, onEvent);
		onEvent();
	}

	function onEvent() {
		window.postMessage(
			{
				sender: 'web-scrobbler',
				type: 'YANDEX_MUSIC_STATE',
				trackInfo: getTrackInfo(),
				isPlaying: API.isPlaying(),
			},
			'*',
		);
	}

	function getTrackInfo() {
		const trackInfo = API.getCurrentTrack();

		const track = trackInfo.title;
		let album = null;
		if (trackInfo.album) {
			album = trackInfo.album.title;
		}

		const trackArt = `https://${trackInfo.cover.replace('%%', '400x400')}`;

		return {
			track,
			album,
			trackArt,

			artist: trackInfo.artists[0].title,
			duration: trackInfo.duration,
			currentTime: API.getProgress().position,
			uniqueID: trackInfo.link,
		};
	}

	return () => {
		API.off(API.EVENT_STATE, onEvent);
		API.off(API.EVENT_TRACK, onEvent);
	};
})();
