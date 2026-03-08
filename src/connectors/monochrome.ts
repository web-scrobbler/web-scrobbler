export {};

Connector.playerSelector = '.now-playing-bar';

Connector.albumSelector = '.now-playing-bar .album';

Connector.trackArtSelector = '.now-playing-bar .cover';

Connector.getArtist = () => {
	const elements = Util.queryElements(
		`${Connector.playerSelector} .artist-link`,
	);
	if (elements) {
		const track = Connector.getTrack()?.toLowerCase();
		return Array.from(elements)
			.map((el) => el.textContent.trim())
			.filter((text) => track?.includes(text.toLowerCase()) === false)
			.join(', ');
	}
};

Connector.getTrack = () => {
	const elements = Util.queryElements(`${Connector.playerSelector} .title`);
	if (elements) {
		for (const element of elements) {
			for (const node of element.childNodes) {
				if (node.nodeType === Node.TEXT_NODE) {
					return node?.textContent?.trim();
				}
			}
		}
	}
};

Connector.isPlaying = () => {
	const audioPlayer = document.getElementById(
		'audio-player',
	) as HTMLAudioElement;
	return audioPlayer && !audioPlayer.paused;
};

Connector.getCurrentTime = () => {
	const audioPlayer = document.getElementById(
		'audio-player',
	) as HTMLAudioElement;
	return audioPlayer ? audioPlayer.currentTime : null;
};

Connector.getDuration = () => {
	const audioPlayer = document.getElementById(
		'audio-player',
	) as HTMLAudioElement;
	return audioPlayer ? audioPlayer.duration : null;
};
