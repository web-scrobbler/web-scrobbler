export {};

Util.bindListeners(
	['audio'],
	['playing', 'pause', 'timeupdate'],
	Connector.onStateChanged,
);

Connector.getDuration = () => {
	return document.querySelector('audio')?.duration;
};

Connector.getCurrentTime = () => {
	return document.querySelector('audio')?.currentTime;
};

Connector.isPlaying = () => {
	return !document.querySelector('audio')?.paused;
};

Connector.trackSelector = '#audio-track-title';
Connector.artistSelector = '#audio-track-artist';
Connector.albumSelector = '#audio-track-album';
Connector.trackArtSelector = '#media-player-cover-image';
