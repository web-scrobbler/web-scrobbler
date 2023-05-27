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
	musicKitPlayer().addEventListener(
		Events.metadataDidChange,
		musicKitSendEvent
	);
	musicKitPlayer().addEventListener(
		Events.playbackStateDidChange,
		musicKitSendEvent
	);
}

function musicKitPlayer() {
	return (window as any).MusicKit.getInstance().player;
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
	const item = musicKitPlayer().nowPlayingItem;
	return {
		album: item.albumName,
		track: item.title,
		artist: item.artistName,
		trackArt: item.artworkURL,
		duration: musicKitPlayer().currentPlaybackDuration,
		uniqueID: item.id,
		currentTime: musicKitPlayer().currentPlaybackTime,
	};
}

function musicKitIsPlaying() {
	return musicKitPlayer().isPlaying;
}
