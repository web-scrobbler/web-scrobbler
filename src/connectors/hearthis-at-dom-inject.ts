/**
 * This script runs in non-isolated environment (hearthis.at itself)
 * for accessing the global `replaceId`, `intposition` and `playlist.info` variables.
 *
 * Script is run as an IIFE to ensure variables are scoped, as in the event
 * of extension reload/update a new script will have to override the current one.
 *
 *  * Script starts by calling window.cleanup to cleanup any potential previous script.
 *
 * @returns a cleanup function that cleans up event listeners and similar for a future overriding script.
 */

// cleanup previous script
if ('cleanup' in window && typeof window.cleanup === 'function') {
	window.cleanup();
}

(window as unknown as { cleanup: () => void }).cleanup = (() => {
	interface Window {
		// replaceId seems to be the only instance of trackId that is actually updating properly.
		// other vars like curTrackId, intTrackId, arrDataCurrentTrack seem to not consistently update when starting new tracks.
		replaceId: number;
		playlist: {
			info: {
				id: string;
				title: string;
				artist: string;
				img: string;
			}[];
		};
		intposition: number;
	}

	interface Update {
		sender: string;
		type: string;
	}

	function isUpdate(obj: MessageEvent<unknown>): obj is MessageEvent<Update> {
		return Boolean(
			obj.data &&
				typeof obj.data === 'object' &&
				'sender' in obj.data &&
				obj.data.sender === 'web-scrobbler' &&
				'type' in obj.data &&
				obj.data.type,
		);
	}

	function listenForUpdates(e: MessageEvent<unknown>) {
		if (!isUpdate(e) || e.data.type !== 'update') {
			return;
		}

		const customWindow = window as unknown as Window;
		const currentSong = customWindow.playlist.info.filter(
			(e) => e.id === customWindow.replaceId?.toString(),
		)[0];
		window.postMessage(
			{
				sender: 'web-scrobbler',
				type: 'info',
				artist: currentSong?.artist,
				title: currentSong?.title,
				img: currentSong?.img,
				currentTime: customWindow.intposition / 1000,
			},
			'*',
		);
	}

	window.addEventListener('message', listenForUpdates);

	return () => {
		window.removeEventListener('message', listenForUpdates);
	};
})();
