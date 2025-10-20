export {};

Connector.playerSelector = '[data-testid="rail-recent_tracks"]';

Connector.isPlaying = () => {
	const btn = document.querySelector('[data-testid="play_pause_button"]');
	return btn?.getAttribute('aria-label')?.toUpperCase() === 'PAUSE';
};

Connector.scrobblingDisallowedReason = () => {
	const firstTrack = document.querySelector(
		'[data-testid="rail-recent_tracks"] li:nth-child(2)',
	);
	const hasNowPlaying = firstTrack?.textContent
		?.toLowerCase()
		.includes('now playing');
	return hasNowPlaying ? null : 'Other';
};

Connector.getArtistTrack = () => {
	const firstTrack = document.querySelector(
		'[data-testid="rail-recent_tracks"] li:nth-child(2)',
	);

	if (!firstTrack?.textContent?.toLowerCase().includes('now playing')) {
		return null;
	}

	const cleanText = (firstTrack as HTMLElement).innerText
		.replace(/(^\d\.|\nnow playing)/gi, '')
		.trim();

	const parts = cleanText.split('\n');
	const track = parts[0]?.trim();
	const artist = parts[1]?.trim();

	return artist && track ? { artist, track } : null;
};

Connector.getTrackArt = () => {
	const firstTrack = document.querySelector(
		'[data-testid="rail-recent_tracks"] li:nth-child(2)',
	);

	if (!firstTrack?.textContent?.toLowerCase().includes('now playing')) {
		return null;
	}

	return firstTrack.querySelector('img')?.src || null;
};
