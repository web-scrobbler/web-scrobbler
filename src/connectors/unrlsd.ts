export {};

Connector.playerSelector = 'body';

Connector.getTrack = () => {
	return (
		navigator.mediaSession.metadata?.title ||
		Util.getTextFromSelectors([
			'.fixed.bottom-3 h4',
			'.fixed.bottom-4 h4',
			'h4',
			'h2',
		])
	);
};

Connector.getArtist = () => {
	return (
		navigator.mediaSession.metadata?.artist ||
		Util.getTextFromSelectors([
			'.fixed.bottom-3 h4 + p',
			'.fixed.bottom-4 h4 + p',
			'h4 + p',
			'h2 + p',
		])
	);
};

Connector.getAlbum = () => {
	if (window.location.pathname.startsWith('/p/')) {
		const album = Util.getTextFromSelectors('h1');
		if (album && album !== '404' && album !== 'Something went wrong') {
			return album;
		}
	}
	return null;
};

Connector.getTrackArt = () => {
	const projectCover = Util.extractImageUrlFromSelectors([
		'img[alt="Project cover"]',
		'.intro-cover img',
		'button[aria-label="Open full screen"] img',
		'button[title="Open full screen"] img',
	]);
	if (projectCover) {
		return projectCover;
	}

	const artwork = navigator.mediaSession.metadata?.artwork;
	if (artwork && artwork.length > 0) {
		const src = artwork[0].src;
		if (src && !src.includes('icon-512.png')) {
			return src;
		}
	}
	return Util.extractImageUrlFromSelectors(['.fixed.inset-0 img']);
};

Connector.isPlaying = () => {
	return (
		navigator.mediaSession.playbackState === 'playing' ||
		Util.isElementVisible('.t-icon-swap[data-state="b"]')
	);
};

Connector.getCurrentTime = () => {
	const seekSlider = document.querySelector(
		'[role="slider"][aria-label="Seek"], [aria-label="Seek"][aria-valuenow]',
	);
	if (seekSlider) {
		const val = seekSlider.getAttribute('aria-valuenow');
		if (val !== null) {
			const time = parseFloat(val);
			if (!isNaN(time)) {
				return time;
			}
		}
	}
	return Util.getSecondsFromSelectors([
		'.fixed.bottom-3 .hidden.md\\:flex span:first-child',
		'.fixed.bottom-4 .hidden.md\\:flex span:first-child',
		'.fixed.bottom-3 .md\\:hidden span:first-child',
		'.fixed.bottom-4 .md\\:hidden span:first-child',
		'.fixed.inset-0 [class*="tabular-nums"] span:first-child',
	]);
};

Connector.getDuration = () => {
	const seekSlider = document.querySelector(
		'[role="slider"][aria-label="Seek"], [aria-label="Seek"][aria-valuemax]',
	);
	if (seekSlider) {
		const max = seekSlider.getAttribute('aria-valuemax');
		if (max !== null) {
			const duration = parseFloat(max);
			if (!isNaN(duration) && duration > 0) {
				return duration;
			}
		}
	}
	return Util.getSecondsFromSelectors([
		'.fixed.bottom-3 .hidden.md\\:flex span:last-child',
		'.fixed.bottom-4 .hidden.md\\:flex span:last-child',
		'.fixed.bottom-3 .md\\:hidden span:last-child',
		'.fixed.bottom-4 .md\\:hidden span:last-child',
	]);
};
