export {};

Connector.playerSelector = '[data-testid*="tracks"]';

function playingTrackElement() {
	const tracks = document.querySelectorAll(
		`${Connector.playerSelector}  li~li`,
	);
	return Array.from(tracks).find((elem) =>
		elem.textContent.toLowerCase().includes('now playing'),
	);
}

Connector.isPlaying = () => {
	return !!playingTrackElement();
};

Connector.getArtistTrack = () => {
	const trackElement = playingTrackElement();

	if (!trackElement) {
		return null;
	}

	const cleanText = (trackElement as HTMLElement).innerText
		.replace(/(^\d+\.|\nnow playing)/gi, '')
		.trim();

	const parts = cleanText.split('\n');
	const track = parts[0]?.trim();
	const artist = parts[1]?.trim();

	return artist && track ? { artist, track } : null;
};

Connector.getTrackArt = () => {
	const trackElement = playingTrackElement();

	return trackElement?.querySelector('img')?.src || null;
};
