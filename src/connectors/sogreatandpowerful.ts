export {};

Connector.artistSelector = 'h1';
Connector.trackSelector = '#info';

Util.bindListeners(
	['audio'],
	['playing', 'pause', 'timeupdate'],
	Connector.onStateChanged,
);

Connector.getTimeInfo = () => {
	const audioElems = Util.queryElements(['audio']);
	if (!audioElems) {
		return null;
	}

	const audioElement = audioElems[0];
	if (!audioElement || !(audioElement instanceof HTMLAudioElement)) {
		return null;
	}
	const { duration, currentTime } = audioElement;
	return { duration, currentTime };
};
