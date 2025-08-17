export {};

Connector.artistSelector = 'h1';
Connector.trackSelector = '#info';

Util.bindListeners(
	['audio'],
	['playing', 'pause', 'timeupdate'],
	Connector.onStateChanged,
);
