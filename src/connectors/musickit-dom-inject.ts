/**
 * This script runs in the context of the player page to access the MusicKit
 * global. It listens to events directly from the player and propagates these
 * events to the extension via 'postMessage'.
 */
musicKitAddEventListeners();

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

async function musicKitAddEventListeners() {
	const Events = (window as unknown as MusicKitWindow).MusicKit.Events;
	const instance = await musicKitInstance();
	instance.addEventListener(Events.metadataDidChange, musicKitSendEvent);
	instance.addEventListener(Events.playbackStateDidChange, musicKitSendEvent);
	instance.addEventListener(
		Events.nowPlayingItemDidChange,
		musicKitSendEvent,
	);
}

async function musicKitInstance() {
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
				reject('MusicKit instance not found');
				return;
			}
		}, 100);
	});
}

async function musicKitSendEvent() {
	window.postMessage(
		{
			sender: 'web-scrobbler',
			type: 'MUSICKIT_STATE',
			trackInfo: await musicKitGetTrackInfo(),
			isPlaying: await musicKitIsPlaying(),
		},
		'*',
	);
}

async function musicKitGetTrackInfo() {
	const instance = await musicKitInstance();
	const item = instance.nowPlayingItem;
	return {
		album: item.albumName,
		track: item.title,
		artist: item.artistName,
		albumArtist: item.container?.attributes?.artistName,
		trackArt: musicKitArtwork(item.artworkURL),
		duration: instance.currentPlaybackDuration,
		uniqueID: item.id,
		currentTime: instance.currentPlaybackTime,
	};
}

function musicKitArtwork(url: string) {
	return url.replace('{w}x{h}bb', '256x256bb');
}

async function musicKitIsPlaying() {
	return (await musicKitInstance()).isPlaying;
}
