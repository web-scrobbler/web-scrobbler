export {};

Connector.artistSelector = 'h1';
Connector.trackSelector = '#info';

Util.bindListeners(
	['audio'],
	['playing', 'pause', 'timeupdate'],
	Connector.onStateChanged,
);

Connector.getTimeInfo = () => {
	const audioElems = Util.queryElements<HTMLAudioElement>(['audio']);
	if (!audioElems) {
		return null;
	}

	const { duration, currentTime } = audioElems[0];
	return { duration, currentTime };
};
