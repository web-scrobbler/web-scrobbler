'use strict';

if (window.dzPlayer) {
	addEventListeners();
} else {
	document.addEventListener('Events.player.playerLoaded', addEventListeners);
}

document.addEventListener('Events.player.playerLoaded', addEventListeners);

function addEventListeners() {
	Events.subscribe(Events.player.play, sendEvent);
	Events.subscribe(Events.player.paused, sendEvent);
	Events.subscribe(Events.player.resume, sendEvent);
}

function sendEvent(e) {
	window.postMessage({
		sender: 'web-scrobbler',
		type: 'DEEZER_STATE',
		state: getState()
	}, '*');
}

function getState() {
	const item = dzPlayer.getCurrentSong();

	return {
		artist: item.ART_NAME,
		title: item.SNG_TITLE,
		album: item.ALB_TITLE,
		duration: dzPlayer.getDuration(),
		currentTime: dzPlayer.getPosition(),
		uniqueId: item.SNG_ID,
		isPlaying: dzPlayer.isPlaying(),
		trackArt: getTrackArt(item.ALB_PICTURE),
		artists: item.ARTISTS
	};
}

function getTrackArt(pic) {
	return `https://e-cdns-images.dzcdn.net/images/cover/${pic}/264x264-000000-80-0-0.jpg`;
}
