interface YandexWindow {
	externalAPI: {
		on: (_: unknown, __: () => void) => void;
		EVENT_STATE: unknown;
		EVENT_TRACK: unknown;
		isPlaying: () => boolean;
		getCurrentTrack: () => {
			title: string;
			album: { title: string };
			cover: string;
			artists: { title: string }[];
			duration: number;
			link: string;
		};
		getProgress: () => { position: number };
	};
}

const YandexAPI = (window as unknown as YandexWindow).externalAPI;

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
		'*',
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
