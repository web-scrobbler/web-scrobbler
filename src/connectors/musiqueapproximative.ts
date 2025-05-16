/**
 * Connector for musiqueapproximative.net
 * Extracts artist and track from <title>, and detects play state via .jp-play visibility.
 */

export {};

Connector.playerSelector = 'body';
Connector.playButtonSelector = '.jp-play';

Connector.getArtistTrack = () => {
	const title = document.title;
	const match = title.match(/^(.+?)\s*-\s*(.+?)\s*\|/);
	if (match) {
		return {
			artist: match[1].trim(),
			track: match[2].trim(),
		};
	}
	return {
		artist: '',
		track: '',
	};
};

Connector.isPlaying = () => {
	const playButton = document.querySelector('.jp-play');
	return playButton && window.getComputedStyle(playButton).display === 'none';
};
