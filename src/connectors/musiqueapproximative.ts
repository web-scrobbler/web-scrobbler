export {};

Connector.playerSelector = 'body';

Connector.playButtonSelector = '.jp-play';

Connector.getArtistTrack = () => {
	const title = document.title;
	console.log('[Web Scrobbler] document.title =', title);
	const match = title.match(/^(.+?)\s*-\s*(.+?)\s*\|/);
	if (match) {
		return {
			artist: match[1].trim(),
			track: match[2].trim(),
		};
	}
	return null;
};

Connector.isPlaying = () => {
	const playButton = document.querySelector('.jp-play');
	const isPlaying = playButton && window.getComputedStyle(playButton).display === 'none';
	return isPlaying;
};
