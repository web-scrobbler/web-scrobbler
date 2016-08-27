'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.getTrack = function() {
	var track = $('#player .title').text();

	//strip extras
	track = track.replace(/\"(.+?)\"/g,'$1'); // stripping WWOZ's double quotes around name
	track = track.replace(/\s*\[[^\]]+\]$/, ''); // [whatever]
	track = track.replace(/\s*\([^\)]*version\)$/i, ''); // (whatever version)

	return track || null;
};

Connector.getArtist = function() {
	return $('#player .artist').text() || null;
};

Connector.isPlaying = function() {
	return $('#oz-audio-container').hasClass('jp-state-playing');
};
