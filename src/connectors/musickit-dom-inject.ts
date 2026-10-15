/**
 * This script runs in non-isolated environment (MusicKit itself)
 * for accessing window variables
 *
 * Script is run as an IIFE to ensure variables are scoped, as in the event
 * of extension reload/update a new script will have to override the current one.
 *
 * Script starts by calling window.cleanup to cleanup any potential previous script.
 *
 * MusicKit may be lazy-loaded by the page (as on music.apple.com), so it may not
 * exist yet when this script is injected. The script therefore polls for the
 * MusicKit global and a configured instance instead of assuming they exist.
 *
 * @returns a cleanup function that cleans up event listeners and similar for a future overriding script.
 */

// cleanup previous script
if ('cleanup' in window && typeof window.cleanup === 'function') {
	(window as unknown as { cleanup: () => void }).cleanup();
}

(window as unknown as { cleanup: () => Promise<void> }).cleanup = (() => {
	interface MusicKitEvents {
		metadataDidChange: unknown;
		playbackStateDidChange: unknown;
		nowPlayingItemDidChange: unknown;
	}

	interface MusicKitWindow {
		MusicKit?: {
			Events?: MusicKitEvents;
			getInstance?: () => MusicKitInstance | undefined;
		};
	}

	interface MusicKitInstance {
		player?: MusicKitInstance;
		addEventListener: (_: unknown, __: () => void) => void;
		removeEventListener: (_: unknown, __: () => void) => void;
		nowPlayingItem?: {
			albumName: string;
			title: string;
			artistName: string;
			artworkURL: string;
			container?: {
				attributes?: { [key: string]: string };
			};
			id: unknown;
		};
		currentPlaybackDuration: number;
		currentPlaybackTime: number;
		isPlaying: boolean;
	}

	const POLL_FAST_MS = 250;
	const POLL_SLOW_MS = 2000;
	const FAST_POLL_DURATION_MS = 60000;

	let boundInstance: MusicKitInstance | null = null;
	let boundEvents: MusicKitEvents | null = null;
	let pollTimer: ReturnType<typeof setTimeout> | null = null;
	let stopped = false;
	const startedAt = Date.now();

	function getPlayer(): {
		player: MusicKitInstance;
		events: MusicKitEvents;
	} | null {
		const api = (window as unknown as MusicKitWindow).MusicKit;
		if (!api || typeof api.getInstance !== 'function' || !api.Events) {
			return null;
		}

		let instance: MusicKitInstance | undefined;
		try {
			instance = api.getInstance();
		} catch {
			return null;
		}
		if (!instance) {
			return null;
		}

		const player = instance.player ?? instance;
		if (typeof player.addEventListener !== 'function') {
			return null;
		}

		return { player, events: api.Events };
	}

	function bind(player: MusicKitInstance, events: MusicKitEvents) {
		unbind();
		player.addEventListener(events.metadataDidChange, sendEvent);
		player.addEventListener(events.playbackStateDidChange, sendEvent);
		player.addEventListener(events.nowPlayingItemDidChange, sendEvent);
		boundInstance = player;
		boundEvents = events;
		sendEvent();
	}

	function unbind() {
		if (!boundInstance || !boundEvents) {
			return;
		}
		try {
			boundInstance.removeEventListener(
				boundEvents.metadataDidChange,
				sendEvent,
			);
			boundInstance.removeEventListener(
				boundEvents.playbackStateDidChange,
				sendEvent,
			);
			boundInstance.removeEventListener(
				boundEvents.nowPlayingItemDidChange,
				sendEvent,
			);
		} catch {
			// the instance may already be torn down; nothing to clean up
		}
		boundInstance = null;
		boundEvents = null;
	}

	function tick() {
		if (stopped) {
			return;
		}
		const found = getPlayer();
		if (found && found.player !== boundInstance) {
			bind(found.player, found.events);
		}
		const elapsed = Date.now() - startedAt;
		const delay =
			!boundInstance && elapsed < FAST_POLL_DURATION_MS
				? POLL_FAST_MS
				: POLL_SLOW_MS;
		pollTimer = setTimeout(tick, delay);
	}

	function sendEvent() {
		const player = boundInstance;
		if (!player) {
			return;
		}

		let trackInfo;
		let isPlaying;
		try {
			trackInfo = getTrackInfo(player);
			isPlaying = Boolean(player.isPlaying);
		} catch {
			return;
		}

		window.postMessage(
			{
				sender: 'web-scrobbler',
				type: 'MUSICKIT_STATE',
				trackInfo,
				isPlaying,
			},
			'*',
		);
	}

	function getTrackInfo(player: MusicKitInstance) {
		const item = player.nowPlayingItem;
		return {
			album: item?.albumName,
			track: item?.title,
			artist: item?.artistName,
			albumArtist: item?.container?.attributes?.artistName,
			trackArt: getArtwork(item?.artworkURL ?? ''),
			duration: player.currentPlaybackDuration,
			uniqueID: item?.id,
			currentTime: player.currentPlaybackTime,
		};
	}

	function getArtwork(url: string) {
		return url.replace('{w}x{h}bb', '256x256bb');
	}

	tick();

	return async () => {
		stopped = true;
		if (pollTimer !== null) {
			clearTimeout(pollTimer);
			pollTimer = null;
		}
		unbind();
	};
})();
