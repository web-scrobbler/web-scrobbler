'use strict';

const YandexAPI = window.externalAPI;

setupListeners();

function setupListeners() {
	YandexAPI.on(YandexAPI.EVENT_STATE, onEvent);
	YandexAPI.on(YandexAPI.EVENT_TRACK, onEvent);
}

function onEvent() {
	window.postMessage({
		sender: 'web-scrobbler',
		type: 'YANDEX_MUSIC_STATE',
		state: getState()
	}, '*');
}

function getState() {
	const trackInfo = YandexAPI.getCurrentTrack();

	let track = trackInfo.title;
	let version = trackInfo.version;
	if (version) {
		track = `${track} (${version})`;
	}

	const trackArt = `https://${trackInfo.cover.replace('%%', '400x400')}`;

	return {
		track, trackArt,

		artist: trackInfo.artists[0].title,
		album: trackInfo.album.title,
		duration: trackInfo.duration,
		currentTime: YandexAPI.getProgress().position,
		uniqueID: trackInfo.link,
		isPlaying: YandexAPI.isPlaying(),
	};
}
