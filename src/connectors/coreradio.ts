export {};

Connector.playerSelector = '#currentlast';

Connector.getArtist = () => {
	const artistLink = document.querySelector(
		'.current_full a[href*="google.com/search"][href*="cx="]',
	);
	return artistLink?.textContent?.trim() || null;
};

Connector.getTrack = () => {
	const links = document.querySelectorAll(
		'.current_full a[href*="google.com/search"][href*="cx="]',
	);
	if (links.length >= 2) {
		const fullText = links[1].textContent?.trim() || '';
		const artist = links[0].textContent?.trim() || '';
		return fullText.replace(`${artist} - `, '').trim() || null;
	}
	return null;
};

Connector.getAlbum = () => {
	const links = document.querySelectorAll(
		'.current_full a[href*="google.com/search"][href*="cx="]',
	);
	if (links.length >= 3) {
		return links[2].textContent?.trim() || null;
	}
	return null;
};

Connector.isPlaying = () => {
	const pauseIcon = document.querySelector(
		'pjsdiv[style*="visible"] svg path[d*="7.70769228"]',
	);
	return pauseIcon !== null;
};
