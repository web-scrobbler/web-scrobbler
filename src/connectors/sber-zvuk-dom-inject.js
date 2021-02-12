'use strict';

function getTrackInfo(track, currentTime) {
	const { title, credits, duration, id, image, release_title: album } = track;
	const trackArt = image.src.replace('{size}', '400x400');

	return {
		track: title,
		artist: credits,
		uniqueID: id,
		duration,
		trackArt,
		currentTime,
		album,
	};
}

function queueEvent(event) {
	let type = null;
	let queue;

	if (event.type !== 'update') {
		return;
	}

	switch (event.name) {
		case 'state':
			type = event.newValue;
			queue = event.object.Queue;
			break;
		case 'currentTime':
		case 'current_idx':
			queue = event.name === 'current_idx' ? event.object : event.object.Queue;
			type = 'currentTime';
			break;
		default:
			return;
	}

	const trackInfo = getTrackInfo(queue.currentTrack, queue.Player.currentTime);

	window.postMessage({
		sender: 'web-scrobbler',
		type,
		trackInfo,
	}, '*');
}

function setupEventListeners() {
	window.newPlayer.$mobx.observe(queueEvent);
}

setupEventListeners();
