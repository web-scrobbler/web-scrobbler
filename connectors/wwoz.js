'use strict';

Connector.playerSelector = '#player';

Connector.artistSelector = '#player .artist';

Connector.getTrack = () => {
	let track = $('#player .title').text();

	//strip extras
	track = track.replace(/\"(.+?)\"/g, '$1'); // stripping WWOZ's double quotes around name
	track = track.replace(/\s*\[[^\]]+\]$/, ''); // [whatever]
	track = track.replace(/\s*\([^\)]*version\)$/i, ''); // (whatever version)

	return track;
};

Connector.isPlaying = () => $('#oz-audio-container').hasClass('jp-state-playing');
