export {};

Connector.playerSelector = '#playerView';

Util.bindListeners(
	['audio'],
	['playing', 'pause', 'waiting'],
	Connector.onStateChanged,
);

Connector.isPlaying = () => !document.querySelector('audio')?.paused;

Connector.useMediaSessionApi();
