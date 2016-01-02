'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.getTrack = function() {
	var track = $('#song-info .song').text();

	//strip extras
	track = track.replace(/\"(.+?)\"/g,'$1') // stripping WWOZ's double quotes around name
	track = track.replace(/\s*\[[^\]]+\]$/, ''); // [whatever]
	track = track.replace(/\s*\([^\)]*version\)$/i, ''); // (whatever version)

	return track || null;
};

Connector.getArtist = function() {
	return $('#song-info .artist').text().replace(/BY: (.+)/g,'$1') || null; // + stripping WWOZ's BY: before artist's name
};

Connector.isPlaying = function() {
	return $('#jp_container_1').hasClass('jp-state-playing');
};
