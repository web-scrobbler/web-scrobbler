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
