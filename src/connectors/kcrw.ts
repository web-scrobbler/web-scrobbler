export {};

const filter = MetadataFilter.createFilter({
	artist: [replaceSmartQuotes],
	track: [
		replaceSmartQuotes,
		MetadataFilter.removeVersion,
		MetadataFilter.removeCleanExplicit,
	],
});

// We use fuzzy class matching (class*=) throughout this connector because the
// class names are CSS modules with build-time hashes (e.g. "AudioPlayer_audioController__3dl_S").
// Only the prefix before the hash is stable across builds.
Connector.playerSelector = '[class*="AudioPlayer_audioController"]';

Connector.getTrackInfo = () => {
	// --- Show More pagination ---
	// Both page types paginate their tracklist. We click "Show More" on each
	// poll cycle until it disappears, ensuring the playing track is in the DOM.

	// EmbeddedTracklist pages (e.g. /shows/.../stories/... episode pages):
	// Show More button has a unique EmbeddedTracklist_pagingShowMore class.
	const embeddedShowMore = document.querySelector<HTMLElement>(
		'[class*="EmbeddedTracklist_pagingShowMore"]',
	);

	// Eclectic24 tracklist page has a Show More button as of right now but we don't need to worry about it because the currently playing track is always in the DOM. If that changes in the future, we can add a selector for it here.
	const showMoreButton = embeddedShowMore;
	if (showMoreButton) {
		showMoreButton.click();
		return null;
	}

	// --- EmbeddedTracklist pages (e.g. /shows/.../stories/... episode pages) ---
	// The currently playing item has an SVG playing indicator inside its prefix element.
	const embeddedPlayingItem = document.querySelector(
		'[class*="EmbeddedTracklist_tracklistItem"]:has([class*="Tracklist_prefix"] svg)',
	);

	if (embeddedPlayingItem) {
		const trackEl = embeddedPlayingItem.querySelector(
			'[class*="Tracklist_trackTitle"]',
		);
		const artistEl = embeddedPlayingItem.querySelector(
			'[class*="Tracklist_artistLabel"]',
		);
		const trackText =
			(trackEl as HTMLElement | null)?.innerText?.trim() ?? null;
		const artistText =
			(artistEl as HTMLElement | null)?.innerText?.trim() ?? null;

		Util.debugLog(`[EmbeddedTracklist] trackText: ${trackText}`);
		Util.debugLog(`[EmbeddedTracklist] artistText: ${artistText}`);

		// There may need to be some sort of check here for BREAK if/when it is
		// possible to support scrobbling from the player.
		// ex. if (trackText === "BREAK" || artistText === "BREAK") return null;
		if (!trackText) {
			return null;
		}

		return { artist: artistText, track: trackText };
	}

	// --- Tracklist pages (e.g. /music/eclectic24-7) ---
	// The currently playing item is marked with a "Now Playing" eyebrow paragraph.
	// Artist is in a dedicated Tracklist_artistLabel span (not the full info div).
	const tracklistPlayingItem = document.querySelector(
		'[class*="Tracklist_tracklistItem"]:has(p.eyebrow)',
	);

	if (tracklistPlayingItem) {
		const trackEl = tracklistPlayingItem.querySelector(
			'[class*="Tracklist_trackTitle"]',
		);
		const artistEl = tracklistPlayingItem.querySelector(
			'[class*="Tracklist_artistLabel"]',
		);
		const trackText =
			(trackEl as HTMLElement | null)?.innerText?.trim() ?? null;
		const artistText =
			(artistEl as HTMLElement | null)?.innerText?.trim() ?? null;

		Util.debugLog(`[Tracklist] trackText: ${trackText}`);
		Util.debugLog(`[Tracklist] artistText: ${artistText}`);

		if (!trackText) {
			return null;
		}

		return { artist: artistText, track: trackText };
	}

	return null;
};

Connector.isPlaying = () => {
	const audio = document.querySelector<HTMLAudioElement>('audio');
	return audio ? !audio.paused : false;
};

Connector.applyFilter(filter);

function replaceSmartQuotes(text: string) {
	return text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"');
}
