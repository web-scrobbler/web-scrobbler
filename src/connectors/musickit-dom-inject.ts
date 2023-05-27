/**
 * This script runs in the context of the player page to access the MusicKit
 * global. It listens to events directly from the player and propagates these
 * events to the extension via 'postMessage'.
 */
if ('MusicKit' in window && window.MusicKit) {
	musicKitAddEventListeners();
} else {
	document.addEventListener('musickitloaded', musicKitAddEventListeners);
}

function musicKitAddEventListeners() {
	const Events = (window as any).MusicKit.Events;
	musicKitInstance().addEventListener(
		Events.metadataDidChange,
		musicKitSendEvent
	);
	musicKitInstance().addEventListener(
		Events.playbackStateDidChange,
		musicKitSendEvent
	);
	musicKitInstance().addEventListener(
		Events.nowPlayingItemDidChange,
		musicKitSendEvent
	);
}

function musicKitInstance() {
	const api = (window as any).MusicKit;
	return api.getInstance().player ?? api.getInstance();
}

function musicKitSendEvent() {
	window.postMessage(
		{
			sender: 'web-scrobbler',
			type: 'MUSICKIT_STATE',
			trackInfo: musicKitGetTrackInfo(),
			isPlaying: musicKitIsPlaying(),
		},
		'*'
	);
}

function musicKitGetTrackInfo() {
	const item = musicKitInstance().nowPlayingItem;
	return {
		album: item.albumName,
		track: item.title,
		artist: item.artistName,
		trackArt: musicKitArtwork(item.artworkURL),
		duration: musicKitInstance().currentPlaybackDuration,
		uniqueID: item.id,
		currentTime: musicKitInstance().currentPlaybackTime,
	};
}

function musicKitArtwork(url: string) {
	return url.replace('{w}x{h}bb', '256x256bb');
}

function musicKitIsPlaying() {
	return musicKitInstance().isPlaying;
}
