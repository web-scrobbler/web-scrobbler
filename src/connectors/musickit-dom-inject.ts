/**
 * This script runs in non-isolated environment (MusicKit itself)
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

(window as unknown as { cleanup: () => Promise<void> }).cleanup = (() => {
	addEventListeners();

	interface MusicKitWindow {
		MusicKit: {
			Events: {
				metadataDidChange: unknown;
				playbackStateDidChange: unknown;
				nowPlayingItemDidChange: unknown;
			};
			getInstance: () => MusicKitInstance;
		};
	}

	interface MusicKitInstance {
		player?: MusicKitInstance;
		addEventListener: (_: unknown, __: () => void) => void;
		removeEventListener: (_: unknown, __: () => void) => void;
		nowPlayingItem: {
			albumName: string;
			title: string;
			artistName: string;
			artworkURL: string;
			container?: {
				attributes?: { [key: string]: string };
			};
			id: unknown;
		};
		currentPlaybackDuration: number;
		currentPlaybackTime: number;
		isPlaying: boolean;
	}

	async function addEventListeners() {
		const Events = (window as unknown as MusicKitWindow).MusicKit.Events;
		const instance = await getInstance();
		instance.addEventListener(Events.metadataDidChange, sendEvent);
		instance.addEventListener(Events.playbackStateDidChange, sendEvent);
		instance.addEventListener(Events.nowPlayingItemDidChange, sendEvent);
		sendEvent();
	}

	async function getInstance() {
		const api = (window as unknown as MusicKitWindow).MusicKit;

		const initInstance = api?.getInstance();
		// If the instance is already available, return it immediately
		if (initInstance) {
			return initInstance?.player ?? initInstance;
		}

		// Otherwise, poll until it is available
		let i = 0;
		return new Promise<MusicKitInstance>((resolve, reject) => {
			const interval = setInterval(() => {
				const instance = api?.getInstance();
				if (instance) {
					clearInterval(interval);
					resolve(instance?.player ?? instance);
					return;
				}
				if (i++ > 100) {
					clearInterval(interval);
					reject(new Error('MusicKit instance not found'));
				}
			}, 100);
		});
	}

	function sendEvent() {
		getTrackInfo().then((trackInfo) => {
			instanceIsPlaying().then((isPlaying) => {
				window.postMessage(
					{
						sender: 'web-scrobbler',
						type: 'MUSICKIT_STATE',
						trackInfo,
						isPlaying,
					},
					'*',
				);
			});
		});
	}

	async function getTrackInfo() {
		const instance = await getInstance();
		const item = instance.nowPlayingItem;
		return {
			album: item.albumName,
			track: item.title,
			artist: item.artistName,
			albumArtist: item.container?.attributes?.artistName,
			trackArt: getArtwork(item.artworkURL),
			duration: instance.currentPlaybackDuration,
			uniqueID: item.id,
			currentTime: instance.currentPlaybackTime,
		};
	}

	function getArtwork(url: string) {
		return url.replace('{w}x{h}bb', '256x256bb');
	}

	async function instanceIsPlaying() {
		return (await getInstance()).isPlaying;
	}

	return async () => {
		const Events = (window as unknown as MusicKitWindow).MusicKit.Events;
		const instance = await getInstance();
		instance.removeEventListener(Events.metadataDidChange, sendEvent);
		instance.removeEventListener(Events.playbackStateDidChange, sendEvent);
		instance.removeEventListener(Events.nowPlayingItemDidChange, sendEvent);
	};
})();
