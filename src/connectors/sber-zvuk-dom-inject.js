'use strict';

const getTrackInfo = (track, currentTime) => {
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
};

const queueEvent = (event) => {
	let type = null;
	let trackInfo; let queue;

	if (event.type === 'update') {
		switch (event.name) {
			case 'state':
				type = event.newValue;
				queue = event.object.Queue;
				trackInfo = getTrackInfo(queue.currentTrack, queue.Player.currentTime);
				break;
			case 'currentTime':
			case 'current_idx':
				queue = event.name === 'current_idx' ? event.object : event.object.Queue;
				trackInfo = getTrackInfo(queue.currentTrack, queue.Player.currentTime);
				type = 'currentTime';
				break;
			case 'buffered':
			case 'isLoading':
			case 'initialPlaying':
			case 'manually':
			default:
				return;
		}
	}

	if (type) {
		window.postMessage({
			sender: 'web-scrobbler',
			type,
			trackInfo,
		}, '*');
	}

};

function setupEventListeners() {
	window.newPlayer.$mobx.observe(queueEvent);
}

setupEventListeners();
