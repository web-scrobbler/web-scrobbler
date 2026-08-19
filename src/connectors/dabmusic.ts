export {};

Connector.playerSelector = 'div.fixed.bottom-0.left-0.right-0';

Connector.getTrack = () => {
	const trackEl = document.querySelector(
		'div.fixed.bottom-0.left-0.right-0 h3.truncate',
	);
	return trackEl ? trackEl.textContent.trim() : null;
};

Connector.getArtist = () => {
	const artistEl = document.querySelector(
		'div.fixed.bottom-0.left-0.right-0 p.text-emerald-400\\/90',
	);
	return artistEl ? artistEl.textContent.trim() : null;
};

Connector.albumSelector =
	'div.inline-flex.items-center.rounded-full.border.px-2\\.5.py-0\\.5.text-emerald-400\\/90';

Connector.trackArtSelector = 'div.fixed.bottom-0.left-0.right-0 img[alt][src]';

Connector.playButtonSelector = 'button[aria-label="Play"]';

const filter = MetadataFilter.createFilter({
	track: cleanupText,
	artist: cleanupText,
	album: cleanupText,
});

function cleanupText(text: string) {
	return text.replace(/\s*\(Explicit\)/i, '').trim();
}

Connector.applyFilter(filter);
