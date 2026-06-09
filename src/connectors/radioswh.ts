export {};

Connector.playerSelector = '#page-footer';

Connector.getTrack = () => {
	const span = document.querySelector('p.music-title span');
	return span ? (span.textContent?.trim() ?? null) : null;
};

Connector.getArtist = () => {
	const p = document.querySelector('p.music-title');
	if (!p) {
		return null;
	}
	if (p.classList.contains('noafter')) {
		const text =
			document
				.querySelector('p.music-sub-title span')
				?.textContent?.trim() || null;
		return text?.startsWith('SWH') ? null : text;
	}
	for (const node of p.childNodes) {
		if (node.nodeType === Node.TEXT_NODE) {
			const text = node.textContent?.trim();
			if (text) {
				return text.startsWith('SWH') ? null : text;
			}
		}
	}
	return null;
};

Connector.isPlaying = () => {
	const img = document.querySelector<HTMLImageElement>(
		'img#play_pause_button_img',
	);
	return img?.src.includes('footer-pause-icon') ?? false;
};
