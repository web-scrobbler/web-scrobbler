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
		trackInfo: getTrackInfo(),
		isPlaying: YandexAPI.isPlaying(),
	}, '*');
}

function getTrackInfo() {
	const trackInfo = YandexAPI.getCurrentTrack();

	let track = trackInfo.title;
	let version = trackInfo.version;
	if (version) {
		track = `${track} (${version})`;
	}
	let album = null;
	if (trackInfo.album) {
		album = trackInfo.album.title;
	}

	const trackArt = `https://${trackInfo.cover.replace('%%', '400x400')}`;

	return {
		track, album, trackArt,

		artist: trackInfo.artists[0].title,
		duration: trackInfo.duration,
		currentTime: YandexAPI.getProgress().position,
		uniqueID: trackInfo.link,
	};
}
