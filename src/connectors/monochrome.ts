export {};

Connector.playerSelector = '.now-playing-bar';

Connector.artistSelector = '.now-playing-bar .artist';

Connector.trackSelector = '.now-playing-bar .title';

Connector.trackArtSelector = '.now-playing-bar .cover';

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

Connector.getAlbum = () => {
	if ('mediaSession' in navigator && navigator.mediaSession.metadata) {
		return navigator.mediaSession.metadata.album;
	}
	return null;
};
