/**
 * This script runs in non-isolated environment(deezer itself)
 * for accessing window variables
 *
 * Script is run as an IIFE to ensure variables are scoped, as in the event
 * of extension reload/update a new script will have to override the current one.
 *
 * Script starts by calling window.cleanup to cleanup any potential previous script.
 *
 * @returns a cleanup function that cleans up event listeners and similar for a future overriding script.
 */

// cleanup previous script
if ('cleanup' in window && typeof window.cleanup === 'function') {
	window.cleanup();
}

(window as unknown as { cleanup: () => void }).cleanup = (() => {
	initConnector();

	function initConnector() {
		let retries = 0;
		if (
			'dzPlayer' in window &&
			window.dzPlayer &&
			'Events' in window &&
			window.Events
		) {
			addEventListeners();
		} else if (retries < 6) {
			window.setTimeout(function () {
				initConnector();
				retries++;
			}, 1007);
		} else {
			Util.debugLog('Failed to initialize deezer connector!', 'warn');
		}
	}

	interface Events {
		player: {
			play: unknown;
			playing: unknown;
			paused: unknown;
			resume: unknown;
			finish: unknown;
		};
		subscribe: (_: unknown, __: unknown) => void;
		unsubscribe: (_: unknown, __: unknown) => void;
	}

	function addEventListeners() {
		if (!('Events' in window)) {
			return;
		}
		const ev = window.Events as Events;
		ev.subscribe(ev.player.play, sendEvent);
		ev.subscribe(ev.player.playing, sendEvent);
		sendEvent();
	}

	function cleanupEventListeners() {
		if (!('Events' in window)) {
			return;
		}
		const ev = window.Events as Events;
		ev.unsubscribe(ev.player.play, sendEvent);
		ev.unsubscribe(ev.player.playing, sendEvent);
	}

	function sendEvent() {
		window.setTimeout(() => {
			const trackInfo = getCurrentMediaInfo();
			const isitPlaying = isPlaying();
			window.postMessage(
				{
					sender: 'web-scrobbler',
					type: 'DEEZER_STATE',
					trackInfo,
					isPlaying: isitPlaying,
					isPodcast: isPodcast(),
				},
				'*',
			);
		}, 1000);
	}

	interface State {
		artist?: string;
		track?: string;
		album?: string;
		uniqueID?: string;
		trackArt?: string;
		duration?: number | null;
		currentTime?: number | null;
	}

	interface Media {
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

	function getCurrentMediaInfo() {
		if (!('dzPlayer' in window)) {
			return;
		}
		const player = window.dzPlayer as {
			getCurrentSong: () => Media | null;
			getPosition: () => number | null;
			getDuration: () => number | string | null;
		};
		const currentMedia = player.getCurrentSong();

		// during initialization the player may not have loaded a media yet
		if (currentMedia === null) {
			return null;
		}

		// Radio stations don't provide track info
		if (currentMedia.EXTERNAL) {
			return null;
		}

		const mediaType = currentMedia.__TYPE__;
		const currentTime = player.getPosition();
		let duration = player.getDuration();
		if (typeof duration === 'string') {
			duration = parseInt(duration);
		}

		let trackInfo: State | null = null;

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

	function getTrackInfo(currentMedia: Media) {
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

	function getEpisodeInfo(currentMedia: Media) {
		return {
			artist: currentMedia.SHOW_NAME,
			track: currentMedia.EPISODE_TITLE,
			uniqueID: currentMedia.EPISODE_ID,
		};
	}

	function isPlaying() {
		if (!('dzPlayer' in window)) {
			return;
		}
		return (window.dzPlayer as { isPlaying: () => boolean }).isPlaying();
	}

	function isPodcast() {
		if (!('dzPlayer' in window)) {
			return;
		}
		const currentMedia = (
			window.dzPlayer as { getCurrentSong: () => Media | null }
		).getCurrentSong();

		// during initialization the player may not have loaded a media yet
		if (currentMedia === null) {
			return null;
		}

		return currentMedia.__TYPE__ === 'episode';
	}

	function getTrackArt(pic: string) {
		return `https://e-cdns-images.dzcdn.net/images/cover/${pic}/264x264-000000-80-0-0.jpg`;
	}

	return () => {
		cleanupEventListeners();
	};
})();
