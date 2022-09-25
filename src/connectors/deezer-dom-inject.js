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
	ev.subscribe(ev.player.playing, sendEvent);
	ev.subscribe(ev.player.paused, sendEvent);
	ev.subscribe(ev.player.resume, sendEvent);
	ev.subscribe(ev.player.finish, sendEvent);
}

function sendEvent() {
	window.postMessage({
		sender: 'web-scrobbler',
		type: 'DEEZER_STATE',
		trackInfo: getCurrentMediaInfo(),
		isPlaying: isPlaying(),
		isPodcast: isPodcast(),
	}, '*');
}

function getCurrentMediaInfo() {
	const player = window.dzPlayer;
	const currentMedia = player.getCurrentSong();

	// Radio stations don't provide track info
	if (currentMedia.EXTERNAL) {
		return null;
	}

	const mediaType = currentMedia.__TYPE__;
	const currentTime = player.getPosition();
	const duration = player.getDuration();

	let trackInfo = null;

	switch (mediaType) {
		case 'episode': {
			trackInfo = getEpisodeInfo(currentMedia);
			break;
		}

		case 'song': {
			trackInfo = getTrackInfo(currentMedia);
			break;
		}
	}

	if (!trackInfo) {
		console.warn(`Web Scrobbler: Unable to load track info for ${mediaType} media type`);
		return null;
	}

	trackInfo.currentTime = currentTime;
	trackInfo.duration = duration;

	return trackInfo;
}

function getTrackInfo(currentMedia) {
	let trackTitle = currentMedia.SNG_TITLE;
	const trackVersion = currentMedia.VERSION;
	if (trackVersion) {
		trackTitle = `${trackTitle} ${trackVersion}`;
	}

	return {
		artist: currentMedia.ART_NAME,
		track: trackTitle,
		album: currentMedia.ALB_TITLE,
		uniqueID: currentMedia.SNG_ID,
		trackArt: getTrackArt(currentMedia.ALB_PICTURE),
	};
}

function getEpisodeInfo(currentMedia) {
	return {
		artist: currentMedia.SHOW_NAME,
		track: currentMedia.EPISODE_TITLE,
		uniqueID: currentMedia.EPISODE_ID,
	};
}

function isPlaying() {
	return window.dzPlayer.isPlaying();
}

function isPodcast() {
	const currentMedia = window.dzPlayer.getCurrentSong();
	return currentMedia.__TYPE__ === 'episode';
}

function getTrackArt(pic) {
	return `https://e-cdns-images.dzcdn.net/images/cover/${pic}/264x264-000000-80-0-0.jpg`;
}
