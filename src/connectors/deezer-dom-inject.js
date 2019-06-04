'use strict';

initConnector();

function initConnector() {
	let retries = 0;
	if (window.dzPlayer && window.Events) {
		addEventListeners();
	} else if (retries < 6) {
		window.setTimeout(function() {
			initConnector();
			retries++;
		}, 1007);
	} else {
		console.warn('Web Scrobbler: Failed to initialize deezer connector!');
	}
}

function addEventListeners() {
	const ev = window.Events;
	ev.subscribe(ev.player.play, sendEvent);
	ev.subscribe(ev.player.paused, sendEvent);
	ev.subscribe(ev.player.resume, sendEvent);
}

function sendEvent() {
	window.postMessage({
		sender: 'web-scrobbler',
		type: 'DEEZER_STATE',
		state: getState()
	}, '*');
}

function getState() {
	const player = window.dzPlayer;
	const item = player.getCurrentSong();

	return {
		artist: item.ART_NAME,
		track: item.SNG_TITLE,
		album: item.ALB_TITLE,
		duration: player.getDuration(),
		currentTime: player.getPosition(),
		uniqueID: item.SNG_ID,
		isPlaying: player.isPlaying(),
		trackArt: getTrackArt(item.ALB_PICTURE)
	};
}

function getTrackArt(pic) {
	return `https://e-cdns-images.dzcdn.net/images/cover/${pic}/264x264-000000-80-0-0.jpg`;
}
