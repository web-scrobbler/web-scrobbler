'use strict';

/**
 * This script runs in the context of the player page to access the MusicKit
 * global. It listens to events directly from the player and propagates these
 * events to the extension via 'postMessage'.
 */
if (window.MusicKit) {
	addEventListeners();
} else {
	document.addEventListener('musickitloaded', addEventListeners);
}

function addEventListeners() {
	const Events = window.MusicKit.Events;
	player().addEventListener(Events.metadataDidChange, sendEvent);
	player().addEventListener(Events.playbackStateDidChange, sendEvent);
}

function player() {
	return window.MusicKit.getInstance().player;
}

function sendEvent() {
	window.postMessage({
		sender: 'web-scrobbler',
		type: 'MUSICKIT_STATE',
		state: getState(),
	}, '*');
}

function getState() {
	const item = player().nowPlayingItem;
	return {
		album: item.albumName,
		track: item.title,
		artist: item.artistName,
		trackArt: item.artworkURL,
		duration: player().currentPlaybackDuration,
		uniqueID: item.id,
		isPlaying: player().isPlaying,
		currentTime: player().currentPlaybackTime,
	};
}
