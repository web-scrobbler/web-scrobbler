import type { ArtistTrackInfo } from '@/core/types';

export {};

const API_URL = 'https://www.lu.lv/api/?r=naba-live/search/';
const POLL_INTERVAL = 30_000;

let currentSong: ArtistTrackInfo | null = null;
let pendingSong: ArtistTrackInfo | null = null;

const PLAYER_SELECTOR = '.player-container';

function isNabaChannel(): boolean {
	return (
		Util.getAttrFromSelectors(`${PLAYER_SELECTOR} .album`, 'title') ===
		'NABA'
	);
}

function checkIsPlaying(): boolean {
	if (!isNabaChannel()) {
		return false;
	}
	return (
		Util.getAttrFromSelectors(
			`${PLAYER_SELECTOR} .area-controls button[aria-pressed]`,
			'aria-pressed',
		) === 'true'
	);
}

async function fetchCurrentSong(): Promise<ArtistTrackInfo | null> {
	try {
		const response = await fetch(API_URL);
		const data = (await response.json()) as { songString?: string };
		if (!data.songString) {
			return null;
		}
		return Util.splitArtistTrack(data.songString);
	} catch {
		return null;
	}
}

function songsMatch(
	a: ArtistTrackInfo | null,
	b: ArtistTrackInfo | null,
): boolean {
	return a?.artist === b?.artist && a?.track === b?.track;
}

async function poll(): Promise<void> {
	if (!checkIsPlaying()) {
		pendingSong = null;
		return;
	}

	const fresh = await fetchCurrentSong();
	if (!fresh) {
		return;
	}

	if (songsMatch(fresh, currentSong)) {
		pendingSong = null;
		return;
	}

	if (songsMatch(fresh, pendingSong)) {
		currentSong = fresh;
		pendingSong = null;
		Connector.onStateChanged();
	} else {
		pendingSong = fresh;
	}
}

setInterval(poll, POLL_INTERVAL);

Connector.playerSelector = PLAYER_SELECTOR;

Connector.getArtistTrack = () => currentSong;

Connector.isPlaying = checkIsPlaying;
