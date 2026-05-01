import type { ArtistTrackInfo } from '@/core/types';

export {};

const API_URL = 'https://www.lu.lv/api/?r=naba-live/search/';
const POLL_INTERVAL = 30_000;

let currentSong: ArtistTrackInfo | null = null;
let pendingSong: ArtistTrackInfo | null = null;

function isNabaChannel(): boolean {
	return new URLSearchParams(window.location.search).get('channel') === '6';
}

function checkIsPlaying(): boolean {
	if (!isNabaChannel()) return false;
	return Util.hasElementClass('.jwplayer', 'jw-state-playing');
}

async function fetchCurrentSong(): Promise<ArtistTrackInfo | null> {
	try {
		const response = await fetch(API_URL);
		const data = (await response.json()) as { songString?: string };
		if (!data.songString) return null;

		return Util.splitArtistTrack(data.songString);
	} catch {
		return null;
	}
}

function songsMatch(a: ArtistTrackInfo | null, b: ArtistTrackInfo | null): boolean {
	return a?.artist === b?.artist && a?.track === b?.track;
}

async function poll(): Promise<void> {
	if (!checkIsPlaying()) {
		pendingSong = null;
		return;
	}

	const fresh = await fetchCurrentSong();
	if (!fresh) return;

	if (songsMatch(fresh, currentSong)) {
		pendingSong = null;
		return;
	}

	if (songsMatch(fresh, pendingSong)) {
		// Same song seen twice (1 minute apart) — promote it
		currentSong = fresh;
		pendingSong = null;
		Connector.onStateChanged();
	} else {
		// New song detected — wait for next poll to confirm
		pendingSong = fresh;
	}
}

setInterval(poll, POLL_INTERVAL);

Connector.playerSelector = '.jwplayer';

Connector.getArtistTrack = () => currentSong;

Connector.isPlaying = checkIsPlaying;
