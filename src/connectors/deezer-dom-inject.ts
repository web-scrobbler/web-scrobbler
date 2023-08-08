import { State } from '@/core/types';

deezerInitConnector();

function deezerInitConnector() {
	let retries = 0;
	if (
		'dzPlayer' in window &&
		window.dzPlayer &&
		'Events' in window &&
		window.Events
	) {
		deezerAddEventListeners();
	} else if (retries < 6) {
		window.setTimeout(function () {
			deezerInitConnector();
			retries++;
		}, 1007);
	} else {
		Util.debugLog('Failed to initialize deezer connector!', 'warn');
	}
}

function deezerAddEventListeners() {
	if (!('Events' in window)) {
		return;
	}
	const ev = window.Events as {
		player: {
			play: unknown;
			playing: unknown;
			paused: unknown;
			resume: unknown;
			finish: unknown;
		};
		subscribe: (_: unknown, __: unknown) => void;
	};
	ev.subscribe(ev.player.play, deezerSendEvent);
	ev.subscribe(ev.player.playing, deezerSendEvent);
	ev.subscribe(ev.player.paused, deezerSendEvent);
	ev.subscribe(ev.player.resume, deezerSendEvent);
	ev.subscribe(ev.player.finish, deezerSendEvent);
}

function deezerSendEvent() {
	window.postMessage(
		{
			sender: 'web-scrobbler',
			type: 'DEEZER_STATE',
			trackInfo: deezerGetCurrentMediaInfo(),
			isPlaying: deezerIsPlaying(),
			isPodcast: deezerIsPodcast(),
		},
		'*',
	);
}

interface DeezerMedia {
	__TYPE__: string;
	EXTERNAL?: unknown;
	SNG_ID?: string;
	SNG_TITLE?: string;
	VERSION?: string;
	ART_NAME?: string;
	ALB_TITLE?: string;
	ALB_PICTURE: string;
	SHOW_NAME?: string;
	EPISODE_TITLE?: string;
	EPISODE_ID?: string;
}

function deezerGetCurrentMediaInfo() {
	if (!('dzPlayer' in window)) {
		return;
	}
	const player = window.dzPlayer as {
		getCurrentSong: () => DeezerMedia;
		getPosition: () => number | null;
		getDuration: () => number | null;
	};
	const currentMedia = player.getCurrentSong();

	// Radio stations don't provide track info
	if (currentMedia.EXTERNAL) {
		return null;
	}

	const mediaType = currentMedia.__TYPE__;
	const currentTime = player.getPosition();
	const duration = player.getDuration();

	let trackInfo: State | null = null;

	switch (mediaType) {
		case 'episode': {
			trackInfo = deezerGetEpisodeInfo(currentMedia);
			break;
		}

		case 'song': {
			trackInfo = deezerGetTrackInfo(currentMedia);
			break;
		}
	}

	if (!trackInfo) {
		Util.debugLog(
			`Unable to load track info for ${mediaType} media type`,
			'warn',
		);
		return null;
	}

	trackInfo.currentTime = currentTime;
	trackInfo.duration = duration;

	return trackInfo;
}

function deezerGetTrackInfo(currentMedia: DeezerMedia) {
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
		trackArt: deezerGetTrackArt(currentMedia.ALB_PICTURE),
	};
}

function deezerGetEpisodeInfo(currentMedia: DeezerMedia) {
	return {
		artist: currentMedia.SHOW_NAME,
		track: currentMedia.EPISODE_TITLE,
		uniqueID: currentMedia.EPISODE_ID,
	};
}

function deezerIsPlaying() {
	if (!('dzPlayer' in window)) {
		return;
	}
	return (window.dzPlayer as { isPlaying: () => boolean }).isPlaying();
}

function deezerIsPodcast() {
	if (!('dzPlayer' in window)) {
		return;
	}
	const currentMedia = (
		window.dzPlayer as { getCurrentSong: () => DeezerMedia }
	).getCurrentSong();
	return currentMedia.__TYPE__ === 'episode';
}

function deezerGetTrackArt(pic: string) {
	return `https://e-cdns-images.dzcdn.net/images/cover/${pic}/264x264-000000-80-0-0.jpg`;
}
