const YandexAPI = (window as any).externalAPI;

yandexSetupListeners();

function yandexSetupListeners() {
	YandexAPI.on(YandexAPI.EVENT_STATE, yandexOnEvent);
	YandexAPI.on(YandexAPI.EVENT_TRACK, yandexOnEvent);
}

function yandexOnEvent() {
	window.postMessage(
		{
			sender: 'web-scrobbler',
			type: 'YANDEX_MUSIC_STATE',
			trackInfo: yandexGetTrackInfo(),
			isPlaying: YandexAPI.isPlaying(),
		},
		'*'
	);
}

function yandexGetTrackInfo() {
	const trackInfo = YandexAPI.getCurrentTrack();

	const track = trackInfo.title;
	let album = null;
	if (trackInfo.album) {
		album = trackInfo.album.title;
	}

	const trackArt = `https://${trackInfo.cover.replace('%%', '400x400')}`;

	return {
		track,
		album,
		trackArt,

		artist: trackInfo.artists[0].title,
		duration: trackInfo.duration,
		currentTime: YandexAPI.getProgress().position,
		uniqueID: trackInfo.link,
	};
}
